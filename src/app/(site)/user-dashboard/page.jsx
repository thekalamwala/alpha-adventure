import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { istToday } from "@/lib/date";
import Dashboard from "./Dashboard";

export const metadata = { title: "My Dashboard" };
export const dynamic = "force-dynamic";

const PAID = new Set(["confirmed", "deposit_paid", "completed"]);

export default async function UserDashboardPage() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/user-dashboard");

  // RLS scopes all three to this user (reviews via the author-read-own policy).
  const [{ data: bookings }, { data: profile }, { data: myReviews }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id,reference,trek_title,departure_date,status,adults,children,grand_total,amount_paid,balance_due,balance_due_date,trek_id,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("reviews").select("booking_id,rating,title,body,status"),
  ]);

  const rows = bookings ?? [];
  const today = istToday();
  // booking_id -> the customer's review, so the dashboard shows status + "Edit".
  const reviewsByBooking = Object.fromEntries(
    (myReviews ?? []).map((r) => [r.booking_id, { rating: r.rating, title: r.title ?? "", body: r.body ?? "", status: r.status }]),
  );
  const stats = {
    total: rows.length,
    upcoming: rows.filter((b) => PAID.has(b.status) && (b.departure_date ?? "") >= today).length,
    spent: rows.filter((b) => PAID.has(b.status)).reduce((s, b) => s + (b.amount_paid || b.grand_total || 0), 0),
  };
  // Payments derived from paid bookings (no separate payments table yet).
  const payments = rows
    .filter((b) => PAID.has(b.status))
    .map((b) => ({ id: b.id, date: b.created_at, reference: b.reference, amount: b.amount_paid || b.grand_total, status: b.status }));

  return (
    <Dashboard
      email={user.email}
      profile={profile ?? {}}
      bookings={rows}
      payments={payments}
      stats={stats}
      reviewsByBooking={reviewsByBooking}
      today={today}
      emailVerified={profile?.email_verified ?? false}
    />
  );
}
