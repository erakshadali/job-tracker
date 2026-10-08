import { STATUSES } from "@/lib/types";
import type { Stats } from "@/lib/applications";

const TONE: Record<(typeof STATUSES)[number], string> = {
  Applied: "text-sky-700 dark:text-sky-300",
  Viewed: "text-violet-700 dark:text-violet-300",
  Interview: "text-emerald-700 dark:text-emerald-300",
  Offer: "text-emerald-800 dark:text-emerald-200",
  Rejected: "text-rose-700 dark:text-rose-300",
  Ghosted: "text-zinc-500 dark:text-zinc-400",
};

export function StatsBar({ stats }: { stats: Stats }) {
  return (
    <section
      aria-label="Summary"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
    >
      <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Total</p>
        <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
      </div>
      {STATUSES.map((s) => (
        <div
          key={s}
          className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
        >
          <p className="text-xs uppercase tracking-wide text-zinc-500">{s}</p>
          <p className={`text-2xl font-semibold tabular-nums ${TONE[s]}`}>
            {stats.byStatus[s]}
          </p>
        </div>
      ))}
      <div className="col-span-2 rounded-lg border border-zinc-200 p-3 sm:col-span-4 lg:col-span-8 dark:border-zinc-800">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Response rate
        </p>
        <p className="text-sm">
          <span className="text-2xl font-semibold tabular-nums">
            {stats.responseRate}%
          </span>{" "}
          of applications were viewed, interviewed, offered or rejected.
        </p>
      </div>
    </section>
  );
}
