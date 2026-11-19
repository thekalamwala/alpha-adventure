import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { termsIntro, termsSections } from "@/data/termsAndConditions";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions that apply to bookings and participation in Alpha Adventures treks, trips, expeditions, and outdoor activities.",
};

const sectionCount = termsSections.length;

const copy = termsSections
  .flatMap((section) =>
    section.body.flatMap((block) =>
      block.type === "ul" ? block.items : [block.text]
    )
  )
  .join(" ");

const wordCount = copy.split(/\s+/).filter(Boolean).length;
const readMinutes = Math.max(1, Math.round(wordCount / 200));

const relatedLinks = [
  { href: "/cancellation-policy", label: "Cancellation policy" },
  { href: "/guides/safety-guidelines", label: "Safety guidelines" },
  { href: "/guides/responsible-travel", label: "Responsible travel" },
];

function SectionBody({ body }) {
  return (
    <div className="space-y-3">
      {body.map((block, i) =>
        block.type === "p" ? (
          <p key={i} className="text-[15.5px] leading-[1.8] text-slate-600">
            {block.text}
          </p>
        ) : (
          <ul
            key={i}
            className="list-disc space-y-2 pl-5 text-[15.5px] leading-[1.8] text-slate-600 marker:text-slate-300"
          >
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        crumb="Terms & Conditions"
        subtitle="The ground rules that keep every Alpha Adventures trek safe, fair and memorable — from your first payment to the last mile."
      />

      <section className="bg-[#fbfaf8] pb-24 pt-16 sm:pt-20">
        <div className="container-px">
          <div className="mx-auto max-w-2xl">
            {/* Intro */}
            <header className="border-b border-slate-200 pb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Legal
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                What you&apos;re agreeing to
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-slate-600">
                {termsIntro}
              </p>
              <p className="mt-6 text-xs text-slate-400">
                {sectionCount} sections &middot; {readMinutes} min read &middot;
                Applies to every booking
              </p>
            </header>

            {/* Terms */}
            <div>
              {termsSections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="grid scroll-mt-28 gap-2 border-b border-slate-200 py-11 sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:gap-6 lg:scroll-mt-32"
                >
                  <p className="text-xs font-semibold tabular-nums text-slate-300 sm:pt-1.5">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold leading-snug tracking-tight text-ink sm:text-[1.35rem]">
                      {section.title}
                    </h2>
                    <div className="mt-4">
                      <SectionBody body={section.body} />
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Closing */}
            <div className="pt-12">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-sm">
                  <h2 className="text-xl font-bold tracking-tight text-ink">
                    Still unsure?
                  </h2>
                  <p className="mt-2 text-[15px] leading-7 text-slate-600">
                    Our team can walk you through payments, cancellations,
                    fitness requirements and anything else on this page.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 text-sm font-semibold sm:items-end">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Contact us
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  {relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-slate-500 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
