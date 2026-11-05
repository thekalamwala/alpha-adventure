"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { istToday } from "@/lib/date";
import { reviewSchema, reviewEligibility, REVIEW_PENDING } from "@/domain/review/review";

type Result = { ok: true } | { ok: false; error: string };

// Submit or edit the customer's review for one of their completed bookings.
// Auth via the SSR session (the signed-in customer); the write uses the service
// role AFTER we re-check ownership + eligibility server-side, so the client can't
// forge booking ownership, trek_id or status. One review per booking (unique
// booking_id) — editing upserts and resets to pending for re-moderation.
export async function submitReview(bookingId: string, raw: unknown): Promise<Result> {
  if (!bookingId || typeof bookingId !== "string") return { ok: false, error: "Missing booking." };

  const ssr = createClient(await cookies());
  const { data: { user } } = await ssr.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid review." };

  const admin = createAdminClient();
  const { data: booking } = await admin
    .from("bookings")
    .select("id,user_id,status,departure_date,trek_id,contact_name,treks(slug)")
    .eq("id", bookingId)
    .maybeSingle();

  const eligible = reviewEligibility(booking, user.id, istToday());
  if (!eligible.ok) return { ok: false, error: eligible.reason };

  const { rating, title, body } = parsed.data;
  // Upsert on booking_id: a first submit creates it, an edit replaces it and
  // sends it back to pending (published_at cleared) so it is re-moderated.
  const { error } = await admin
    .from("reviews")
    .upsert(
      {
        booking_id: bookingId,
        trek_id: booking!.trek_id,
        user_id: user.id,
        author_name: (booking as { contact_name?: string }).contact_name ?? null,
        rating,
        title,
        body,
        status: REVIEW_PENDING,
        published_at: null,
      },
      { onConflict: "booking_id" },
    );
  if (error) {
    console.error("[submitReview]", error.message);
    return { ok: false, error: "Could not save your review." };
  }

  revalidatePath("/user-dashboard");
  const slug = (booking!.treks as { slug?: string } | null)?.slug;
  if (slug) revalidatePath(`/treks/${slug}`);
  return { ok: true };
}
