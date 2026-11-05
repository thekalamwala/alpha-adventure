import { describe, it, expect } from "vitest";
import {
  reviewSchema,
  reviewEligibility,
  reviewStatusLabel,
  REVIEW_PENDING,
  REVIEW_APPROVED,
  REVIEW_REJECTED,
} from "./review";

describe("reviewSchema", () => {
  it("accepts a valid review", () => {
    const r = reviewSchema.safeParse({ rating: 5, title: "Great", body: "Loved it" });
    expect(r.success).toBe(true);
  });

  it("coerces string rating", () => {
    const r = reviewSchema.safeParse({ rating: "4", title: "Nice", body: "Fun" });
    expect(r.success && r.data.rating).toBe(4);
  });

  it("rejects out-of-range rating", () => {
    expect(reviewSchema.safeParse({ rating: 0, title: "x", body: "y" }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 6, title: "x", body: "y" }).success).toBe(false);
  });

  it("rejects empty title or body", () => {
    expect(reviewSchema.safeParse({ rating: 5, title: "", body: "y" }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 5, title: "x", body: "" }).success).toBe(false);
  });
});

describe("reviewEligibility", () => {
  const me = "user-1";
  const today = "2026-11-05";

  it("allows a completed booking regardless of date", () => {
    expect(reviewEligibility({ user_id: me, status: "completed", departure_date: "2030-01-01" }, me, today).ok).toBe(true);
  });

  it("allows a paid booking whose trip is over", () => {
    expect(reviewEligibility({ user_id: me, status: "confirmed", departure_date: "2026-10-01" }, me, today).ok).toBe(true);
    expect(reviewEligibility({ user_id: me, status: "deposit_paid", departure_date: "2026-10-01" }, me, today).ok).toBe(true);
  });

  it("blocks a trip that hasn't happened yet", () => {
    const r = reviewEligibility({ user_id: me, status: "confirmed", departure_date: "2026-12-01" }, me, today);
    expect(r.ok).toBe(false);
  });

  it("blocks an unpaid booking", () => {
    const r = reviewEligibility({ user_id: me, status: "pending_payment", departure_date: "2026-10-01" }, me, today);
    expect(r.ok).toBe(false);
  });

  it("blocks someone else's booking", () => {
    const r = reviewEligibility({ user_id: "user-2", status: "completed", departure_date: "2026-10-01" }, me, today);
    expect(r.ok).toBe(false);
  });

  it("blocks a missing booking", () => {
    expect(reviewEligibility(null, me, today).ok).toBe(false);
  });
});

describe("reviewStatusLabel", () => {
  it("maps content_status to a label", () => {
    expect(reviewStatusLabel(REVIEW_PENDING)).toBe("Pending");
    expect(reviewStatusLabel(REVIEW_APPROVED)).toBe("Approved");
    expect(reviewStatusLabel(REVIEW_REJECTED)).toBe("Rejected");
  });
});
