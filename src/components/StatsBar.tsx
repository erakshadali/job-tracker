import { STATUSES } from "@/lib/types";
import type { Filters } from "@/lib/types";
import type { Stats } from "@/lib/applications";
import { STATUS_STYLE } from "@/lib/statusStyle";

function Card({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

export function StatsBar({
  stats,
  active,
  onSelect,
}: {
  stats: Stats;
  active: Filters["status"];
  onSelect: (status: Filters["status"]) => void;
}) {
  const inProgress = stats.byStatus.Interview + stats.byStatus.Offer;
  const closed = stats.byStatus.Rejected + stats.byStatus.Ghosted;

  return (
    <section aria-label="Summary" className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card label="Total" value={stats.total} hint="applications tracked" />
        <Card
          label="Response rate"
          value={`${stats.responseRate}%`}
          hint="viewed, interviewed, offered or rejected"
        />
        <Card
          label="In progress"
          value={inProgress}
          hint="interviews and offers"
        />
        <Card label="Closed" value={closed} hint="rejected or ghosted" />
      </div>

      <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div
          role="img"
          aria-label="Applications by status"
          className="flex h-2.5 overflow-hidden rounded-full bg-surface-2"
        >
          {STATUSES.map((s) =>
            stats.byStatus[s] > 0 ? (
              <div
                key={s}
                className={STATUS_STYLE[s].bar}
                style={{ width: `${(stats.byStatus[s] / stats.total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={active === "All"}
            onClick={() => onSelect("All")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              active === "All"
                ? "border-accent bg-accent-soft text-accent"
                : "border-line text-muted hover:text-ink"
            }`}
          >
            All {stats.total}
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={active === s}
              onClick={() => onSelect(active === s ? "All" : s)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                active === s
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-muted hover:text-ink"
              }`}
            >
              <span
                className={`size-2 rounded-full ${STATUS_STYLE[s].bar}`}
                aria-hidden="true"
              />
              {s} {stats.byStatus[s]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
