import { NextResponse } from "next/server";
import { getListingTreks } from "@/lib/trekListing";

// Lightweight list of published treks for the hero typeahead. Public data
// (published only, via the anon client in getListingTreks). Cached 5 min.
export const revalidate = 300;

export async function GET() {
  const treks = await getListingTreks();
  const items = treks.map((t) => ({
    slug: t.slug,
    title: t.title,
    location: t.location ?? "",
    href: t.href,
  }));
  return NextResponse.json({ treks: items });
}
