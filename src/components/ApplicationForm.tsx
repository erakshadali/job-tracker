"use client";

import { useState } from "react";
import { PLATFORMS, STATUSES } from "@/lib/types";
import type { NewApplication, Platform, Status } from "@/lib/types";
import { todayIso } from "@/lib/applications";

const field =
  "w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700";

export function ApplicationForm({
  onAdd,
}: {
  onAdd: (a: NewApplication) => void;
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
    setError("");
    onAdd({
      company: company.trim(),
      role: role.trim(),
      platform,
      status,
      appliedOn: appliedOn || todayIso(),
      location: location.trim(),
      notes: notes.trim(),
    });
    setCompany("");
    setRole("");
    setLocation("");
    setNotes("");
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-800"
    >
      <h2 className="text-base font-semibold sm:col-span-2">Add application</h2>
      <label className="grid gap-1 text-sm">
        Company
        <input
          className={field}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Role
        <input
          className={field}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </label>
      <label className="grid gap-1 text-sm">
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
      <label className="grid gap-1 text-sm">
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
      <label className="grid gap-1 text-sm">
        Applied on (blank means today)
        <input
          type="date"
          className={field}
          value={appliedOn}
          onChange={(e) => setAppliedOn(e.target.value)}
        />
      </label>
      <label className="grid gap-1 text-sm">
        Location
        <input
          className={field}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <label className="grid gap-1 text-sm sm:col-span-2">
        Notes
        <textarea
          rows={2}
          className={field}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Add
        </button>
        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
