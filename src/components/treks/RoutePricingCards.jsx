import Link from "next/link";
import { site } from "@/data/site";
import { trekCostBySlug, tripCostBySlug, tourTripCostBySlug } from "@/data/route-pricing";
import CopyTrekPhone from "./CopyTrekPhone";
import { getGoogleReviewSettings } from "@/lib/getGoogleReviewSettings";
import { formatGoogleReviews } from "@/lib/googleReviewSettings";

const phoneHref = site.phone ? `tel:${site.phone.replace(/[^+\d]/g, "")}` : null;

// Format paise -> "₹1,299" for the single-price headline.
const rupees = (paise) => "₹" + Math.round((paise || 0) / 100).toLocaleString("en-IN");

// Desktop: two-column table. Mobile: stacked route/price rows — same data,
// no horizontal overflow on small screens.
function PricingTable({ rows }) {
  const route = (r) => (
    <>
      <span className="font-medium text-ink">{r.route}</span>
      {r.sub && <span className="mt-0.5 block text-xs font-bold text-ink">{r.sub}</span>}
      {r.subItalic && <span className="block text-xs italic text-gray-500">{r.subItalic}</span>}
    </>
  );
  const cost = (r) => (
    <>
      <span className="font-bold text-primary">{r.price}</span>{" "}
      <span className="text-xs text-gray-500">/ Person</span>
    </>
  );

  return (
    <>
      <table className="hidden w-full table-fixed border-collapse text-center text-sm sm:table">
        <thead>
          <tr className="bg-primary text-white">
            <th className="w-3/5 border border-primary-dark/40 px-4 py-3 font-bold">
              Pickup - Drop
            </th>
            <th className="border border-primary-dark/40 px-4 py-3 font-bold">Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.route} className="even:bg-page/60">
              <td className="border border-line px-4 py-3.5 align-middle">{route(r)}</td>
              <td className="border border-line px-4 py-3.5 align-middle">{cost(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="overflow-hidden rounded-xl2 border border-line/70 text-sm sm:hidden">
        <div className="bg-primary px-4 py-3 text-center font-bold text-white">
          Pickup - Drop · Cost
        </div>
        {rows.map((r, i) => (
          <div key={r.route} className={`px-4 py-3 text-center ${i ? "border-t border-line" : ""}`}>
            <div>{route(r)}</div>
            <div className="mt-1">{cost(r)}</div>
          </div>
        ))}
      </div>
    </>
  );
}

async function TrekCostCard({ headline, bookHref, groupSize, inclusions }) {
  const leader = inclusions.find((item) => /trek (?:leader|guide)/i.test(item));
  const permits = inclusions.find((item) => /\bpermits?\b/i.test(item));
  const details = [
    ["bi-people", groupSize ? `Group size: ${groupSize}` : null],
    ["bi-shield-check", leader],
    ["bi-tree", permits === leader ? null : permits],
    ["bi-star-fill", formatGoogleReviews(await getGoogleReviewSettings())],
  ];

  return (
    <aside aria-label="Trek Cost" className="rounded-[24px] border border-[#c7d9ca] bg-white p-5 text-[#18382b] shadow-soft sm:p-6">
      <h3 className="m-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[#355648]">Trek Cost, including GST</h3>
      {headline && (
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-4xl font-extrabold leading-tight tracking-tight">{headline}</span>
          <span className="text-xs text-[#426454]">per person</span>
        </div>
      )}
      <Link href={bookHref} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ff571f] px-4 py-2 text-sm font-bold text-[#101d17] transition hover:bg-[#ff773f] hover:text-[#101d17]">
        Book Now <i className="bi bi-arrow-right" aria-hidden="true" />
      </Link>

      {(site.phone || site.secondaryPhone) && (
        <div className="mt-4">
          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#355648]">Call our trek expert</h4>
          <div className="divide-y divide-[#e1e9e2] rounded-xl border border-[#e1e9e2]">
            {[site.phone, site.secondaryPhone].filter(Boolean).map((phone) => (
              <div key={phone} className="flex items-center justify-between gap-2 px-3 py-2">
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="select-text whitespace-nowrap text-xs font-semibold text-[#18382b] hover:text-[#315e46]">{phone}</a>
                <CopyTrekPhone phone={phone} />
              </div>
            ))}
          </div>
        </div>
      )}
      {site.whatsapp && (
        <a href={site.whatsapp} target="_blank" rel="noreferrer"
          className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-[#a6bdaa] px-4 py-2 text-sm font-semibold text-[#18382b] transition hover:bg-white/70 hover:text-[#315e46]">
          <i className="bi bi-whatsapp" aria-hidden="true" /> WhatsApp us
        </a>
      )}
      <ul className="mb-0 mt-4 space-y-2 border-t border-[#c7d9ca] pt-3 text-xs leading-relaxed text-[#355648]">
        {details.filter(([, text]) => text).map(([icon, text]) => (
          <li key={icon} className="flex items-baseline gap-2">
            <i className={`bi ${icon} shrink-0 text-[#b6481f]`} aria-hidden="true" /> {text}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function PricingCard({ title, data, bookHref, whatsapp }) {
  if (!data) return null;
  const noteList = data.notes ?? [];
  return (
    <div className="flex h-full flex-col rounded-xl2 border border-line/70 bg-white p-6 shadow-soft sm:p-8">
      <h3 className="text-2xl font-extrabold text-ink">{title}</h3>
      <p className="mb-5 text-sm font-medium text-gray-500">including GST</p>

      <div className="min-h-[220px]">
        <PricingTable rows={data.rows} />
      </div>

      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2"
        >
          Enquire Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      ) : (
        <Link
          href={bookHref}
          className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2"
        >
          Book Now
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}

      {noteList.length ? (
        <div className="mt-6 min-h-[150px] flex-1">
          <h4 className="mb-2 text-sm font-bold text-ink">Note:</h4>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600">
            {noteList.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {phoneHref && (
        <a
          href={phoneHref}
          className="btn-secondary mt-6 inline-flex w-full items-center justify-center gap-2"
        >
          <i className="bi bi-telephone" /> Call Our Trek Expert
        </a>
      )}
    </div>
  );
}

// Renders the route-pricing cards on a trek detail page. `variant="trek"`
// renders just the Trek Cost card (sidebar); `variant="trip"` renders just the
// Trip Cost card (full-width). Looks up data by slug; renders nothing when the
// requested card has no data for the trek.
export function RoutePricingCard({ slug, bookHref, variant = "trek", basePrice, groupSize, inclusions = [] }) {
  if (variant === "trek") {
    const data = trekCostBySlug[slug];
    if (!data && basePrice == null) return null;
    return <TrekCostCard headline={basePrice != null ? rupees(basePrice) : data?.rows?.[0]?.price}
      bookHref={bookHref}
      groupSize={groupSize} inclusions={inclusions} />;
  }
  const data = variant === "tour" ? tourTripCostBySlug[slug] : tripCostBySlug[slug];
  return <PricingCard title="Trip Cost" data={data} bookHref={bookHref} whatsapp={variant === "tour" ? site.whatsapp : null} />;
}

export default function RoutePricingCards({ slug, bookHref }) {
  const trekCost = trekCostBySlug[slug];
  const tripCost = tripCostBySlug[slug];
  if (!trekCost && !tripCost) return null;

  return (
    <div className="mt-16 grid items-stretch gap-6 md:grid-cols-2" id="section-route-pricing">
      <PricingCard title="Trek Cost" data={trekCost} bookHref={bookHref} />
      <PricingCard title="Trip Cost" data={tripCost} bookHref={bookHref} />
    </div>
  );
}
