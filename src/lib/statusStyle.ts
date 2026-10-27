import type { Status } from "./types";

// Pill = soft tinted badge; bar = solid segment in the distribution bar.
export const STATUS_STYLE: Record<Status, { pill: string; bar: string }> = {
  Applied: {
    pill: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    bar: "bg-sky-500",
  },
  Viewed: {
    pill: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
    bar: "bg-violet-500",
  },
  Interview: {
    pill: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  Offer: {
    pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  Rejected: {
    pill: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
    bar: "bg-rose-500",
  },
  Ghosted: {
    pill: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
    bar: "bg-zinc-400",
  },
};
