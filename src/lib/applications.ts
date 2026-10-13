import { PLATFORMS, STATUSES } from "./types";
import type { Application, Filters, Platform, Status } from "./types";

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

/** Full backup of every application as pretty JSON (used by Export JSON). */
export function toJson(items: Application[]): string {
  return JSON.stringify(items, null, 2);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Reads a JSON backup and returns clean rows. Throws an Error with a readable
 * message when the file is not a list of applications, so a bad file can never
 * overwrite real data. Unknown platform/status fall back to Other/Applied.
 */
export function parseImport(text: string): Application[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }
  if (!Array.isArray(data)) {
    throw new Error("Expected a list of applications.");
  }
  const rows: Application[] = [];
  for (const entry of data) {
    if (typeof entry !== "object" || entry === null) continue;
    const r = entry as Record<string, unknown>;
    const company = asText(r.company);
    const role = asText(r.role);
    if (company === "" || role === "") continue;
    const platform = PLATFORMS.includes(r.platform as Platform)
      ? (r.platform as Platform)
      : "Other";
    const status = STATUSES.includes(r.status as Status)
      ? (r.status as Status)
      : "Applied";
    const appliedOn = /^\d{4}-\d{2}-\d{2}$/.test(asText(r.appliedOn))
      ? asText(r.appliedOn)
      : todayIso();
    rows.push({
      id: asText(r.id) || crypto.randomUUID(),
      company,
      role,
      platform,
      status,
      appliedOn,
      location: asText(r.location),
      notes: asText(r.notes),
    });
  }
  if (rows.length === 0) {
    throw new Error("No valid applications found in this file.");
  }
  return rows;
}

function dedupeKey(a: Application): string {
  return `${a.company}|${a.role}|${a.appliedOn}`.toLowerCase();
}

/** Adds imported rows to existing ones, skipping duplicates and demo rows. */
export function mergeApplications(
  existing: Application[],
  imported: Application[],
): { merged: Application[]; added: number } {
  const real = existing.filter((a) => !a.id.startsWith("sample-"));
  const seen = new Set(real.map(dedupeKey));
  const fresh: Application[] = [];
  for (const a of imported) {
    const key = dedupeKey(a);
    if (seen.has(key)) continue;
    seen.add(key);
    fresh.push(a);
  }
  return { merged: [...real, ...fresh], added: fresh.length };
}
