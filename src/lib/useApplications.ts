"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SAMPLE_APPLICATIONS } from "./sample";
import type { Application, NewApplication, Status } from "./types";

const KEY = "job-tracker:applications:v1";
const EMPTY: Application[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedValue: Application[] = EMPTY;

function readSnapshot(): Application[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    // First visit (nothing stored yet): show demo rows so the app is not blank.
    // They are not saved, so the first real change or Clear replaces them.
    const parsed: unknown = raw === null ? SAMPLE_APPLICATIONS : JSON.parse(raw);
    cachedValue = Array.isArray(parsed) ? (parsed as Application[]) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function write(next: Application[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be blocked (private mode); keep the in-memory value only.
    cachedRaw = null;
    cachedValue = next;
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useApplications() {
  const items = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY);

  const add = useCallback((input: NewApplication) => {
    const item: Application = { ...input, id: crypto.randomUUID() };
    const real = readSnapshot().filter((a) => !a.id.startsWith("sample-"));
    write([item, ...real]);
  }, []);

  const setStatus = useCallback((id: string, status: Status) => {
    write(readSnapshot().map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const remove = useCallback((id: string) => {
    write(readSnapshot().filter((a) => a.id !== id));
  }, []);

  const replaceAll = useCallback((next: Application[]) => write(next), []);

  return { items, add, setStatus, remove, replaceAll };
}
