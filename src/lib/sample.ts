import type { Application } from "./types";

/** Clearly fictional rows so a new visitor can see the app working. */
export const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: "sample-1",
    company: "Example Labs (sample)",
    role: "Frontend Developer",
    platform: "LinkedIn",
    status: "Viewed",
    appliedOn: "2026-10-06",
    location: "Noida",
    notes: "Sample row. Recruiter viewed the application.",
  },
  {
    id: "sample-2",
    company: "Demo Studio (sample)",
    role: "MERN Stack Developer",
    platform: "Naukri",
    status: "Interview",
    appliedOn: "2026-10-04",
    location: "Remote",
    notes: "Sample row. First round on Friday.",
  },
  {
    id: "sample-3",
    company: "Placeholder Tech (sample)",
    role: "Web Developer",
    platform: "Email",
    status: "Applied",
    appliedOn: "2026-10-08",
    location: "Gurugram",
    notes: "Sample row. Sent resume to HR.",
  },
  {
    id: "sample-4",
    company: "Test Works (sample)",
    role: "Software Engineer",
    platform: "Company site",
    status: "Rejected",
    appliedOn: "2026-09-30",
    location: "Delhi",
    notes: "Sample row. Asked for 4+ years.",
  },
];
