import { z } from "zod";

export const googleReviewSettingsKey = "google_reviews";

export const googleReviewSettingsSchema = z.object({
  rating: z.number().min(1).max(5).refine((rating) => Number.isInteger(rating * 10), "Use at most one decimal place."),
  count: z.number().int().nonnegative(),
  showPlus: z.boolean(),
});

export type GoogleReviewSettings = z.infer<typeof googleReviewSettingsSchema>;
export const defaultGoogleReviewSettings: GoogleReviewSettings = { rating: 4.9, count: 775, showPlus: true };

export function formatGoogleReviews({ rating, count, showPlus }: GoogleReviewSettings) {
  return `${rating}/5 from ${count.toLocaleString("en-IN")}${showPlus ? "+" : ""} Google reviews`;
}
