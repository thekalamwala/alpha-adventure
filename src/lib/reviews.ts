import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type PublicReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author: string;
  date: string | null;
};

// Approved reviews for a trek, for the public detail page. Uses the RLS-scoped
// SSR client; the reviews_read policy exposes only status='published' rows, so no
// pending/rejected review can leak here. author_name is denormalised on the row,
// so we never touch the private profiles table.
export async function getTrekReviews(
  trekId: string | null | undefined,
): Promise<{ items: PublicReview[]; avg: number; count: number }> {
  if (!trekId) return { items: [], avg: 0, count: 0 };
  const supabase = createClient(await cookies());
  const { data } = await supabase
    .from("reviews")
    .select("id,rating,title,body,author_name,published_at,created_at")
    .eq("trek_id", trekId)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const rows = data ?? [];
  const count = rows.length;
  const avg = count ? rows.reduce((s, r) => s + (r.rating || 0), 0) / count : 0;
  const items: PublicReview[] = rows.map((r) => ({
    id: r.id as string,
    rating: (r.rating as number) ?? 0,
    title: (r.title as string) ?? null,
    body: (r.body as string) ?? null,
    author: ((r.author_name as string) || "Verified traveller").trim(),
    date: (r.published_at as string) ?? (r.created_at as string) ?? null,
  }));
  return { items, avg, count };
}
