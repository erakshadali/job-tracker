# Job Application Tracker

A small Next.js app for tracking job applications: company, role, platform, status, date and notes. It shows a summary of every status and a response rate, lets you search and filter, and exports the current view to CSV.

Built with **Next.js (App Router), TypeScript in strict mode, and Tailwind CSS**. Data stays in the browser (`localStorage`), so there is no backend or sign-in.

## Features

- Add, update the status of, and delete applications
- Statuses: Applied, Viewed, Interview, Offer, Rejected, Ghosted
- Summary counts and a response rate (viewed, interviewed, offered or rejected out of all applications)
- Search by company, role, location or notes, and filter by status
- Export the filtered list to CSV (commas and quotes are escaped)
- Light and dark mode through the system setting
- "Load sample rows" button with clearly fictional data for a first look

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (Vitest)
npm run typecheck  # tsc --noEmit
npm run build
```

## How it is organised

| Path | What it does |
| --- | --- |
| `src/lib/types.ts` | Domain types and the allowed statuses and platforms |
| `src/lib/applications.ts` | Pure functions: filtering, stats, CSV, date helper (covered by tests) |
| `src/lib/useApplications.ts` | Storage hook built on `useSyncExternalStore` and `localStorage`, safe when storage is blocked |
| `src/components/` | Form, table and stats components |
| `src/app/page.tsx` | The page that ties them together |

## Notes

- The add form leaves the date blank and resolves "today" when you submit. Reading the current time while Next.js prerenders the page breaks the production build.
- Storage reads are cached by their raw string so `useSyncExternalStore` gets a stable snapshot.
