import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import TrekCard from "@/components/ui/TrekCard";
import { getListingTreks } from "@/lib/trekListing";

export const revalidate = 300;

export async function generateMetadata(props) {
  const sp = await props.searchParams;
  const q = (sp?.q ?? "").toString().trim();
  return { title: q ? `Search: ${q}` : "Search treks" };
}

export default async function SearchPage(props) {
  const sp = await props.searchParams;
  const q = (sp?.q ?? "").toString().trim();
  const all = await getListingTreks();
  const ql = q.toLowerCase();
  const results = ql
    ? all.filter(
        (t) =>
          t.title.toLowerCase().includes(ql) ||
          (t.location ?? "").toLowerCase().includes(ql) ||
          (t.group ?? "").toLowerCase().includes(ql),
      )
    : [];

  return (
    <>
      <PageHero
        title={q ? `Results for “${q}”` : "Search treks"}
        crumb="Search"
        subtitle="Find your next trek by name, fort or place."
      />
      <div className="container-px py-14">
        {!q ? (
          <p className="text-gray-600">Type a trek, fort or place to search. <Link href="/treks" className="font-semibold text-primary hover:underline">Or browse all treks →</Link></p>
        ) : results.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-line py-16 text-center">
            <p className="text-gray-600">No treks match “{q}”.</p>
            <Link href="/treks" className="mt-3 inline-block font-semibold text-primary hover:underline">Browse all treks →</Link>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-gray-500">{results.length} trek{results.length > 1 ? "s" : ""} found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((t) => (
                <TrekCard key={t.slug} trek={t} href={t.href} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
