import { requireAdmin } from "@/app/admin/data";
import ReviewsAdmin from "./ReviewsAdmin";

// Standalone admin moderation area (like /admin/team). requireAdmin() enforces
// staff/admin server-side and redirects otherwise — approval is never client-trusted.
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const { admin } = await requireAdmin();

  const { data } = await admin
    .from("reviews")
    .select(
      "id,rating,title,body,status,created_at,published_at," +
        "bookings(reference,contact_name,contact_email,trek_title),treks(title)",
    )
    .order("created_at", { ascending: false });

  const rows = ((data ?? []) as any[]).map((r) => {
    const b = r.bookings as { reference?: string; contact_name?: string; contact_email?: string; trek_title?: string } | null;
    const t = r.treks as { title?: string } | null;
    return {
      id: r.id as string,
      rating: (r.rating as number) ?? 0,
      title: (r.title as string) ?? "",
      body: (r.body as string) ?? "",
      status: r.status as string,
      created: r.created_at as string,
      customer: b?.contact_name || b?.contact_email || "Guest",
      reference: b?.reference ?? "—",
      trek: t?.title ?? b?.trek_title ?? "—",
    };
  });

  return <ReviewsAdmin rows={rows} />;
}
