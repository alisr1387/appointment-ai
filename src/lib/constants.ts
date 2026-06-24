import type { LeadScore, LeadStatus } from "@prisma/client";

export const ONBOARDING_STEPS = [
  { path: "/onboarding/business", label: "Business info", step: 1 },
  { path: "/onboarding/category", label: "Category", step: 2 },
  { path: "/onboarding/services", label: "Services", step: 3 },
  { path: "/onboarding/goal", label: "Conversion goal", step: 4 },
  { path: "/onboarding/knowledge", label: "AI knowledge", step: 5 },
  { path: "/onboarding/complete", label: "Publish", step: 6 },
] as const;

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  in_conversation: "In conversation",
  qualified: "Qualified",
  nurture: "Nurture",
  follow_up_sent: "Follow-up sent",
  appointment_requested: "Appointment requested",
  appointment_booked: "Appointment booked",
  lost: "Lost",
};

export const LEAD_SCORE_LABELS: Record<LeadScore, string> = {
  HOT: "HOT",
  WARM: "WARM",
  COLD: "COLD",
};

export const CATEGORY_LABELS = {
  skin_beauty_clinic: "Skin & Beauty Clinic",
} as const;

export const CONVERSION_GOAL_LABELS = {
  book_appointment: "Book Appointment",
  get_leads: "Get Leads",
  receive_orders: "Receive Orders",
  book_calls: "Book Calls",
} as const;
