import { z } from "zod";

// Customer reviews. Pure, framework-free logic shared by the submit server action
// (src/app/(site)/user-dashboard/reviewActions.ts), the dashboard form and the
// admin moderation area. Kept out of "server-only" so it is unit-testable and the
// client form can reuse the same schema.

// Moderation maps onto the existing content_status enum (see 0034_reviews_app.sql):
//   pending = draft, approved = published, rejected = archived.
export const REVIEW_PENDING = "draft" as const;
export const REVIEW_APPROVED = "published" as const;
export const REVIEW_REJECTED = "archived" as const;
export type ReviewStatus = typeof REVIEW_PENDING | typeof REVIEW_APPROVED | typeof REVIEW_REJECTED;

// Label for the UI, from the stored content_status value.
export function reviewStatusLabel(status: string): "Pending" | "Approved" | "Rejected" {
  if (status === REVIEW_APPROVED) return "Approved";
  if (status === REVIEW_REJECTED) return "Rejected";
  return "Pending"; // draft or anything else not yet published
}

// What a customer can submit. rating required; title + text required and bounded.
export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5, "Rating is 1–5"),
  title: z.string().trim().min(1, "Add a title").max(160, "Title too long"),
  body: z.string().trim().min(1, "Write a few words").max(4000, "Review too long"),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

// A booking is reviewable when it belongs to the customer, was paid, and the trip
// is over. We accept the paid states (the trip happened) with a past departure, as
// well as an explicitly 'completed' booking — covers sites that don't auto-complete.
const PAID_STATUSES = new Set(["confirmed", "deposit_paid", "completed"]);

export type ReviewableBooking = {
  user_id: string | null;
  status: string;
  departure_date: string | null; // 'YYYY-MM-DD'
};

// `todayIso` is 'YYYY-MM-DD' (date-only string compares lexically, same as dates).
export function reviewEligibility(
  booking: ReviewableBooking | null | undefined,
  userId: string,
  todayIso: string,
): { ok: true } | { ok: false; reason: string } {
  if (!booking) return { ok: false, reason: "Booking not found." };
  if (!booking.user_id || booking.user_id !== userId)
    return { ok: false, reason: "This booking isn't yours." };
  if (booking.status === "completed") return { ok: true };
  if (!PAID_STATUSES.has(booking.status))
    return { ok: false, reason: "Only paid bookings can be reviewed." };
  if (!booking.departure_date || booking.departure_date >= todayIso)
    return { ok: false, reason: "You can review after the trip." };
  return { ok: true };
}
