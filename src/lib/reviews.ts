import "server-only";
import { createAdminClient } from "@/utils/supabase/admin";

export type PublicReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author: string;
  date: string | null;
};

// Approved reviews for a trek, for the public detail page. Uses the cookie-free
// service-role client (not the SSR/cookies client) so this stays compatible with
// the trek page's ISR `revalidate` — reading cookies there throws in Next 15.
// Service role bypasses RLS, so we filter status='published' EXPLICITLY; no
// pending/rejected review can leak. author_name is denormalised on the row, so we
// never touch the private profiles table.
export async function getTrekReviews(
  trekId: string | null | undefined,
): Promise<{ items: PublicReview[]; avg: number; count: number }> {
  if (!trekId) return { items: [], avg: 0, count: 0 };
  const supabase = createAdminClient();
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
