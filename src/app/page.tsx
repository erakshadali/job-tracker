"use client";

import { useMemo, useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ApplicationTable } from "@/components/ApplicationTable";
import { StatsBar } from "@/components/StatsBar";
import {
  computeStats,
  filterApplications,
  toCsv,
} from "@/lib/applications";
import { SAMPLE_APPLICATIONS } from "@/lib/sample";
import { STATUSES } from "@/lib/types";
import type { Filters } from "@/lib/types";
import { useApplications } from "@/lib/useApplications";

export default function Home() {
  const { items, add, setStatus, remove, replaceAll } = useApplications();
  const [filters, setFilters] = useState<Filters>({ query: "", status: "All" });

  const visible = useMemo(
    () => filterApplications(items, filters),
    [items, filters],
  );
  const stats = useMemo(() => computeStats(items), [items]);

  function exportCsv() {
    const blob = new Blob([toCsv(visible)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8">
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold">Job Application Tracker</h1>
        <p className="text-sm text-zinc-500">
          Keep every application, its status and its notes in one place. Data
          stays in this browser.
        </p>
      </header>

      {items.some((a) => a.id.startsWith("sample-")) && (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
          Demo data: these rows are fictional. Add your own application or
          delete a row and the demo rows are replaced with yours.
        </p>
      )}

      <StatsBar stats={stats} />
      <ApplicationForm onAdd={add} />

      <section aria-label="Applications" className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            aria-label="Search applications"
            placeholder="Search company, role, notes"
            className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
          <select
            aria-label="Filter by status"
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value as Filters["status"],
              })
            }
          >
            <option>All</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={exportCsv}
            disabled={visible.length === 0}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700"
          >
            Export CSV
          </button>
          {items.length === 0 && (
            <button
              type="button"
              onClick={() => replaceAll(SAMPLE_APPLICATIONS)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              Load sample rows
            </button>
          )}
        </div>
        <ApplicationTable
          items={visible}
          onStatus={setStatus}
          onRemove={remove}
        />
      </section>
    </main>
  );
}
