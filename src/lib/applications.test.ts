import { describe, expect, it } from "vitest";
import {
  computeStats,
  filterApplications,
  mergeApplications,
  parseImport,
  toJson,
  todayIso,
  toCsv,
} from "./applications";
import type { Application } from "./types";

const base: Omit<Application, "id" | "company" | "status" | "appliedOn"> = {
  role: "Frontend Developer",
  platform: "LinkedIn",
  location: "Noida",
  notes: "",
};

const items: Application[] = [
  { ...base, id: "1", company: "Alpha", status: "Applied", appliedOn: "2026-10-01" },
  { ...base, id: "2", company: "Beta", status: "Viewed", appliedOn: "2026-10-03" },
  { ...base, id: "3", company: "Gamma", status: "Rejected", appliedOn: "2026-10-02" },
  { ...base, id: "4", company: "Delta", status: "Interview", appliedOn: "2026-10-04" },
];

describe("filterApplications", () => {
  it("sorts newest first", () => {
    const out = filterApplications(items, { query: "", status: "All" });
    expect(out.map((a) => a.company)).toEqual(["Delta", "Beta", "Gamma", "Alpha"]);
  });

  it("filters by status and search text", () => {
    expect(
      filterApplications(items, { query: "", status: "Viewed" }).map((a) => a.id),
    ).toEqual(["2"]);
    expect(
      filterApplications(items, { query: "gam", status: "All" }).map((a) => a.id),
    ).toEqual(["3"]);
  });
});

describe("computeStats", () => {
  it("counts statuses and the response rate", () => {
    const stats = computeStats(items);
    expect(stats.total).toBe(4);
    expect(stats.byStatus.Applied).toBe(1);
    expect(stats.responseRate).toBe(75);
  });

  it("returns zero for an empty list", () => {
    expect(computeStats([]).responseRate).toBe(0);
  });
});

describe("toCsv", () => {
  it("escapes commas and quotes", () => {
    const csv = toCsv([
      { ...items[0], company: 'A, "B" Ltd', notes: "line one" },
    ]);
    expect(csv.split("\n")[1]).toContain('"A, ""B"" Ltd"');
  });
});

describe("todayIso", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    expect(todayIso(new Date(2026, 9, 8))).toBe("2026-10-08");
  });
});

describe("toJson / parseImport", () => {
  it("round-trips an export", () => {
    expect(parseImport(toJson(items))).toEqual(items);
  });

  it("cleans bad fields and drops rows without company or role", () => {
    const rows = parseImport(
      JSON.stringify([
        { company: " Acme ", role: "Dev", platform: "Nope", status: "???" },
        { company: "", role: "Dev" },
        "junk",
      ]),
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      company: "Acme",
      platform: "Other",
      status: "Applied",
    });
    expect(rows[0].appliedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("rejects files that are not a list of applications", () => {
    expect(() => parseImport("not json")).toThrow("not valid JSON");
    expect(() => parseImport('{"a":1}')).toThrow("list of applications");
    expect(() => parseImport("[]")).toThrow("No valid applications");
  });
});

describe("mergeApplications", () => {
  it("skips duplicates and replaces demo rows", () => {
    const demo: Application = { ...base, id: "sample-1", company: "Demo", status: "Applied", appliedOn: "2026-10-01" };
    const dupe = { ...items[0], id: "other-id" };
    const fresh: Application = { ...base, id: "9", company: "New Co", status: "Applied", appliedOn: "2026-10-13" };
    const { merged, added } = mergeApplications([demo, items[0]], [dupe, fresh]);
    expect(added).toBe(1);
    expect(merged.map((a) => a.company)).toEqual(["Alpha", "New Co"]);
  });
});
