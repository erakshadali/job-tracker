"use client";

import { useState } from "react";
import { PLATFORMS, STATUSES } from "@/lib/types";
import type { NewApplication, Platform, Status } from "@/lib/types";
import { todayIso } from "@/lib/applications";

const field =
  "w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm placeholder:text-muted/70 focus:border-accent";

// Rendered inside the dialog, so it mounts fresh each time the dialog opens
// and the fields start empty without any reset logic.
export function ApplicationForm({
  onAdd,
  onCancel,
}: {
  onAdd: (a: NewApplication) => void;
  onCancel: () => void;
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [platform, setPlatform] = useState<Platform>("LinkedIn");
  const [status, setStatus] = useState<Status>("Applied");
  // Left blank on purpose: reading the clock during prerender breaks the build,
  // so an empty date means "today" and is resolved on submit.
  const [appliedOn, setAppliedOn] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      setError("Add a company and a role.");
      return;
    }
    onAdd({
      company: company.trim(),
      role: role.trim(),
      platform,
      status,
      appliedOn: appliedOn || todayIso(),
      location: location.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-medium">
        Company
        <input
          className={field}
          placeholder="e.g. Acme Corp"
          autoFocus
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Role
        <input
          className={field}
          placeholder="e.g. Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Platform
        <select
          className={field}
          value={platform}
          onChange={(e) => setPlatform(e.target.value as Platform)}
        >
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Status
        <select
          className={field}
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Applied on
        <input
          type="date"
          className={field}
          value={appliedOn}
          onChange={(e) => setAppliedOn(e.target.value)}
        />
        <span className="text-xs font-normal text-muted">
          Leave blank for today.
        </span>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Location
        <input
          className={field}
          placeholder="City or Remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
        Notes
        <textarea
          rows={3}
          className={field}
          placeholder="Contacts, salary, next steps…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <div className="flex items-center justify-end gap-3 sm:col-span-2">
        {error && (
          <p role="alert" className="mr-auto text-sm text-rose-600">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-ink"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink shadow-sm transition hover:opacity-90"
        >
          Add application
        </button>
      </div>
    </form>
  );
}
