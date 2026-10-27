"use client";

import { useState } from "react";
import { STATUSES } from "@/lib/types";
import type { Application, Status } from "@/lib/types";
import { STATUS_STYLE } from "@/lib/statusStyle";

interface Handlers {
  onStatus: (id: string, status: Status) => void;
  onRemove: (id: string) => void;
}

// Pill-styled native select: keeps keyboard and screen reader behaviour.
function StatusSelect({
  item,
  onStatus,
}: {
  item: Application;
  onStatus: Handlers["onStatus"];
}) {
  return (
    <select
      aria-label={`Status for ${item.company}`}
      className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-semibold ${STATUS_STYLE[item.status].pill}`}
      value={item.status}
      onChange={(e) => onStatus(item.id, e.target.value as Status)}
    >
      {STATUSES.map((s) => (
        <option key={s} className="bg-surface text-ink">
          {s}
        </option>
      ))}
    </select>
  );
}

// Two-step delete: the first click asks, the second one removes.
function DeleteButton({ item, onRemove }: { item: Application; onRemove: Handlers["onRemove"] }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button
        type="button"
        aria-label={`Delete ${item.company}`}
        onClick={() => setConfirming(true)}
        className="rounded-lg px-2 py-1 text-xs font-medium text-muted transition hover:bg-rose-500/10 hover:text-rose-600"
      >
        Delete
      </button>
    );
  }
  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="rounded-lg bg-rose-600 px-2 py-1 text-xs font-semibold text-white"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg px-2 py-1 text-xs text-muted hover:text-ink"
      >
        Keep
      </button>
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-sm font-semibold text-accent"
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export function ApplicationTable({
  items,
  onStatus,
  onRemove,
  onAdd,
}: Handlers & { items: Application[]; onAdd: () => void }) {
  if (items.length === 0) {
    return (
      <div className="grid justify-items-center gap-2 rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
        <p className="font-semibold">No applications to show</p>
        <p className="max-w-sm text-sm text-muted">
          Nothing matches the current search or filter. Clear them, or add a
          new application to start tracking.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink"
        >
          Add application
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Phones: one card per application. */}
      <ul className="grid gap-3 md:hidden">
        {items.map((a) => (
          <li
            key={a.id}
            className="grid gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Avatar name={a.company} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{a.company}</p>
                <p className="truncate text-sm text-muted">{a.role}</p>
              </div>
              <StatusSelect item={a} onStatus={onStatus} />
            </div>
            <p className="text-xs text-muted">
              {a.platform} · {a.appliedOn}
              {a.location && ` · ${a.location}`}
            </p>
            {a.notes && <p className="text-sm text-muted">{a.notes}</p>}
            <div className="-mb-1 flex justify-end">
              <DeleteButton item={a} onRemove={onRemove} />
            </div>
          </li>
        ))}
      </ul>

      {/* Tablets and up: a table. */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Platform</th>
              <th className="px-4 py-3 font-medium">Applied</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr
                key={a.id}
                className="border-t border-line align-middle transition hover:bg-surface-2/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={a.company} />
                    <div className="min-w-0">
                      <p className="font-semibold">{a.company}</p>
                      {a.location && (
                        <p className="text-xs text-muted">{a.location}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p>{a.role}</p>
                  {a.notes && (
                    <p className="max-w-xs truncate text-xs text-muted" title={a.notes}>
                      {a.notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{a.platform}</td>
                <td className="px-4 py-3 tabular-nums text-muted">
                  {a.appliedOn}
                </td>
                <td className="px-4 py-3">
                  <StatusSelect item={a} onStatus={onStatus} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton item={a} onRemove={onRemove} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
