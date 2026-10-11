export const STATUSES = [
  "Applied",
  "Viewed",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
] as const;

export type Status = (typeof STATUSES)[number];

export const PLATFORMS = [
  "LinkedIn",
  "Naukri",
  "Instahyre",
  "Indeed",
  "Wellfound",
  "Internshala",
  "Company site",
  "Email",
  "Referral",
  "Walk-in",
  "Other",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export interface Application {
  id: string;
  company: string;
  role: string;
  platform: Platform;
  status: Status;
  /** ISO date, YYYY-MM-DD */
  appliedOn: string;
  location: string;
  notes: string;
}

export type NewApplication = Omit<Application, "id">;

export interface Filters {
  query: string;
  status: Status | "All";
}
