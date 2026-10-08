"use client";

import { STATUSES } from "@/lib/types";
import type { Application, Status } from "@/lib/types";

export function ApplicationTable({
  items,
  onStatus,
  onRemove,
}: {
  items: Application[];
  onStatus: (id: string, status: Status) => void;
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
        No applications match. Add one above, or load the sample rows to see how
        the tracker works.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th className="px-3 py-2">Company</th>
            <th className="px-3 py-2">Role</th>
            <th className="px-3 py-2">Platform</th>
            <th className="px-3 py-2">Applied</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr
              key={a.id}
              className="border-t border-zinc-200 align-top dark:border-zinc-800"
            >
              <td className="px-3 py-2">
                <p className="font-medium">{a.company}</p>
                {a.location && (
                  <p className="text-xs text-zinc-500">{a.location}</p>
                )}
              </td>
              <td className="px-3 py-2">
                <p>{a.role}</p>
                {a.notes && <p className="text-xs text-zinc-500">{a.notes}</p>}
              </td>
              <td className="px-3 py-2">{a.platform}</td>
              <td className="px-3 py-2 tabular-nums">{a.appliedOn}</td>
              <td className="px-3 py-2">
                <select
                  aria-label={`Status for ${a.company}`}
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1 dark:border-zinc-700"
                  value={a.status}
                  onChange={(e) => onStatus(a.id, e.target.value as Status)}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => onRemove(a.id)}
                  className="text-xs text-rose-600 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
