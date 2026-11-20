import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { termsIntro, termsSections } from "@/data/termsAndConditions";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions that apply to bookings and participation in Alpha Adventures treks, trips, expeditions, and outdoor activities.",
};

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
      <link rel="stylesheet" href="/assets/css/legal.css" />
      <section
        className="breadcrumb-section"
        style={{ backgroundImage: "linear-gradient(rgba(17, 15, 15, .55), rgba(17, 15, 15, .55)), url('/assets/img/innerpages/breadcrumb-bg1.jpg')" }}
      >
        <div className="container">
          <div className="banner-content">
            <h1>Terms &amp; Conditions</h1>
            <ul className="breadcrumb-list">
              <li><Link href="/">Home</Link></li>
              <li>Terms &amp; Conditions</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="policy-page pt-80 mb-120">
        <div className="container">
          <div className="row justify-content-center">
            <article className="col-lg-10">
              <div className="tc-wrapper">
                <header className="tc-header">
                  <i className="bi bi-shield-check" aria-hidden="true" />
                  <h2>Terms &amp; Conditions</h2>
                </header>
                <div className="mb-8 rounded border-l-4 border-primary bg-[#fff8f0] px-5 py-4">
                  {termsIntro}
                </div>
                {/* Terms */}
                <div>
                  {termsSections.map((section, index) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="tc-section scroll-mt-28"
                    >
                      <span className="tc-num" aria-hidden="true">{index + 1}</span>
                      <div className="tc-content">
                        <h3 className="text-xl font-bold leading-snug text-ink">
                          {section.title}
                        </h3>
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
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
