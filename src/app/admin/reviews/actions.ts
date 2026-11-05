"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/admin/data";
import { REVIEW_APPROVED, REVIEW_REJECTED, REVIEW_PENDING } from "@/domain/review/review";

type Result = { ok: true } | { ok: false; error: string };

// Revalidate the admin dashboard and the public trek page the review belongs to,
// so an approve/reject shows/hides it publicly right away.
async function revalidateFor(
  admin: Awaited<ReturnType<typeof requireAdmin>>["admin"],
  id: string,
) {
  const { data } = await admin.from("reviews").select("treks(slug)").eq("id", id).maybeSingle();
  revalidatePath("/admin");
  const slug = (data?.treks as { slug?: string } | null)?.slug;
  if (slug) revalidatePath(`/treks/${slug}`);
}

export async function approveReview(id: string): Promise<Result> {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("reviews")
    .update({ status: REVIEW_APPROVED, published_at: new Date().toISOString() })
    .eq("id", id);
  if (error) { console.error("[approveReview]", error.message); return { ok: false, error: "Could not approve." }; }
  await revalidateFor(admin, id);
  return { ok: true };
}

export async function rejectReview(id: string): Promise<Result> {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("reviews")
    .update({ status: REVIEW_REJECTED, published_at: null })
    .eq("id", id);
  if (error) { console.error("[rejectReview]", error.message); return { ok: false, error: "Could not reject." }; }
  await revalidateFor(admin, id);
  return { ok: true };
}

// Send an approved/rejected review back to the moderation queue.
export async function resetReview(id: string): Promise<Result> {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("reviews")
    .update({ status: REVIEW_PENDING, published_at: null })
    .eq("id", id);
  if (error) { console.error("[resetReview]", error.message); return { ok: false, error: "Could not update." }; }
  await revalidateFor(admin, id);
  return { ok: true };
}
