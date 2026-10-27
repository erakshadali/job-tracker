"use client";

import { useMemo, useRef, useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ApplicationTable } from "@/components/ApplicationTable";
import { StatsBar } from "@/components/StatsBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  computeStats,
  filterApplications,
  mergeApplications,
  parseImport,
  toCsv,
  toJson,
} from "@/lib/applications";
import { SAMPLE_APPLICATIONS } from "@/lib/sample";
import { STATUSES } from "@/lib/types";
import type { Application, Filters } from "@/lib/types";
import { useApplications } from "@/lib/useApplications";

type Sort = "newest" | "oldest" | "company";

const SORTS: Record<Sort, (a: Application, b: Application) => number> = {
  newest: (a, b) => b.appliedOn.localeCompare(a.appliedOn),
  oldest: (a, b) => a.appliedOn.localeCompare(b.appliedOn),
  company: (a, b) => a.company.localeCompare(b.company),
};

const control =
  "rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-accent";
const menuItem =
  "block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40";

export default function Home() {
  const { items, add, setStatus, remove, replaceAll } = useApplications();
  const [filters, setFilters] = useState<Filters>({ query: "", status: "All" });
  const [sort, setSort] = useState<Sort>("newest");
  const [adding, setAdding] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const menuRef = useRef<HTMLDetailsElement>(null);

  const visible = useMemo(
    () => [...filterApplications(items, filters)].sort(SORTS[sort]),
    [items, filters, sort],
  );
  const stats = useMemo(() => computeStats(items), [items]);
  const isDemo = items.some((a) => a.id.startsWith("sample-"));

  function download(text: string, type: string, filename: string) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    if (menuRef.current) menuRef.current.open = false;
  }

  function exportCsv() {
    download(toCsv(visible), "text/csv", "applications.csv");
  }

  // Backup of every row (ignores the search/filter) that Import JSON can read.
  function exportJson() {
    const real = items.filter((a) => !a.id.startsWith("sample-"));
    download(toJson(real), "application/json", "job-tracker-backup.json");
  }

  async function importJson(file: File | undefined) {
    if (!file) return;
    try {
      const { merged, added } = mergeApplications(
        items,
        parseImport(await file.text()),
      );
      replaceAll(merged);
      setImportMessage(`Imported ${added} new application(s).`);
    } catch (error) {
      setImportMessage(
        error instanceof Error ? error.message : "Could not import this file.",
      );
    }
    if (menuRef.current) menuRef.current.open = false;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-accent text-accent-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold leading-tight">
              Job Application Tracker
            </h1>
            <p className="hidden text-xs text-muted sm:block">
              Saved in this browser only
            </p>
          </div>

          <details ref={menuRef} className="relative">
            <summary
              className={`${control} cursor-pointer list-none font-medium`}
            >
              Data
            </summary>
            <div className="absolute right-0 mt-2 grid w-48 gap-0.5 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
              <button
                type="button"
                className={menuItem}
                onClick={exportCsv}
                disabled={visible.length === 0}
              >
                Export CSV
              </button>
              <button
                type="button"
                className={menuItem}
                onClick={exportJson}
                disabled={items.every((a) => a.id.startsWith("sample-"))}
              >
                Export JSON backup
              </button>
              <label className={`${menuItem} cursor-pointer`}>
                Import JSON
                <input
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={(e) => {
                    void importJson(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {items.length === 0 && (
                <button
                  type="button"
                  className={menuItem}
                  onClick={() => {
                    replaceAll(SAMPLE_APPLICATIONS);
                    if (menuRef.current) menuRef.current.open = false;
                  }}
                >
                  Load sample rows
                </button>
              )}
            </div>
          </details>

          <ThemeToggle />
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink shadow-sm transition hover:opacity-90"
          >
            <span aria-hidden="true">+ </span>Add
            <span className="hidden sm:inline"> application</span>
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-6">
        {isDemo && (
          <p className="rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <strong>Demo data.</strong> These rows are fictional. Add your own
            application or delete a row and the demo rows are replaced with
            yours.
          </p>
        )}

        <StatsBar
          stats={stats}
          active={filters.status}
          onSelect={(status) => setFilters({ ...filters, status })}
        />

        <section aria-label="Applications" className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              aria-label="Search applications"
              placeholder="Search company, role, notes"
              className={`${control} min-w-0 flex-1 basis-56`}
              value={filters.query}
              onChange={(e) =>
                setFilters({ ...filters, query: e.target.value })
              }
            />
            <select
              aria-label="Filter by status"
              className={control}
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
            <select
              aria-label="Sort applications"
              className={control}
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="company">Company A–Z</option>
            </select>
          </div>
          {importMessage !== "" && (
            <p role="status" className="text-sm text-muted">
              {importMessage}
            </p>
          )}
          <ApplicationTable
            items={visible}
            onStatus={setStatus}
            onRemove={remove}
            onAdd={() => setAdding(true)}
          />
        </section>
      </main>

      {adding && (
        <dialog
          ref={(el) => {
            if (el && !el.open) el.showModal();
          }}
          aria-labelledby="add-title"
          onClose={() => setAdding(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setAdding(false);
          }}
          className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-line bg-surface p-6 text-ink shadow-2xl"
        >
          <h2 id="add-title" className="mb-4 text-lg font-semibold">
            Add application
          </h2>
          <ApplicationForm
            onAdd={(a) => {
              add(a);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </dialog>
      )}
    </div>
  );
}
