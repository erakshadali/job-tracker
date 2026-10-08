import { STATUSES } from "./types";
import type { Application, Filters, Status } from "./types";

export function filterApplications(
  items: Application[],
  { query, status }: Filters,
): Application[] {
  const q = query.trim().toLowerCase();
  return items
    .filter((a) => status === "All" || a.status === status)
    .filter(
      (a) =>
        q === "" ||
        `${a.company} ${a.role} ${a.location} ${a.notes}`
          .toLowerCase()
          .includes(q),
    )
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
}

export interface Stats {
  total: number;
  byStatus: Record<Status, number>;
  /** Share of applications that got any human response, 0-100. */
  responseRate: number;
}

export function computeStats(items: Application[]): Stats {
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<
    Status,
    number
  >;
  for (const a of items) byStatus[a.status] += 1;

  const responded =
    byStatus.Viewed + byStatus.Interview + byStatus.Offer + byStatus.Rejected;
  const responseRate =
    items.length === 0 ? 0 : Math.round((responded / items.length) * 100);

  return { total: items.length, byStatus, responseRate };
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(items: Application[]): string {
  const header = [
    "Company",
    "Role",
    "Platform",
    "Status",
    "Applied on",
    "Location",
    "Notes",
  ];
  const rows = items.map((a) =>
    [a.company, a.role, a.platform, a.status, a.appliedOn, a.location, a.notes]
      .map(csvCell)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function todayIso(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
