import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import BeginnerGuideNav from "@/components/BeginnerGuideNav";
import { site } from "@/data/site";

export const metadata = {
  title: "Beginner Trek Guide",
  description:
    "A practical guide for first-time trekkers: how to choose your first trek, avoid common mistakes, understand trekking terms, and prepare for the trail.",
  keywords:
    "beginner trekking guide, first trek, trekking tips, Sahyadri treks for beginners, trekking glossary",
};

const quickFacts = [
  { label: "Difficulty", value: "Start with Level 1 routes" },
  { label: "Duration", value: "2–3 day weekends" },
  { label: "Pack weight", value: "Keep it to 7–10 kg" },
  { label: "Best seasons", value: "Oct–Nov · Mar–Apr" },
];

const firstTreks = [
  {
    title: "Start with Level 1 Treks",
    body: "Choose treks that are under 5–6 hours with low altitude gain. Popular routes with good infrastructure are ideal for first-timers. Look for well-marked trails with villages or campsites along the way.",
  },
  {
    title: "Check the Season & Weather",
    body: "Every trek has an ideal season. Monsoon treks offer lush greenery but slippery trails. Winter treks are clearer but colder. Research the best time for your chosen route before booking.",
  },
  {
    title: "Pick a Group Trek",
    body: "As a beginner, always trek with an organized group. Experienced guides handle navigation, safety, and logistics. You focus on enjoying the experience and building your confidence.",
  },
  {
    title: "Consider Duration & Budget",
    body: "Weekend treks (2–3 days) are perfect for testing the waters. Factor in travel time, permit costs, guide fees, and gear. Start affordable and upgrade as you gain experience.",
  },
];

const mistakes = [
  {
    title: "Overpacking",
    body: "Carrying too much weight exhausts you faster, causes injury, and reduces enjoyment. Limit yourself to 7–10 kg. Pack only essentials and skip “just in case” items.",
  },
  {
    title: "Wearing brand new, untested gear",
    body: "New boots cause blisters. Untested gear fails when needed. Break in hiking boots weeks before. Wear and wash all clothing. Test all gear beforehand.",
  },
  {
    title: "Starting too fast",
    body: "Lack of fitness leads to exhaustion and injuries. Train for 2–4 weeks minimum. Do cardio and strength exercises. Build gradually.",
  },
  {
    title: "Not staying hydrated",
    body: "Dehydration causes headaches and poor decision-making. Carry 2–3 L water capacity. Drink regularly, not just when thirsty. Add electrolytes.",
  },
  {
    title: "Racing ahead",
    body: "Racing ahead burns out your energy. Slow and steady wins. Listen to your body. Take regular breaks. Enjoy the journey.",
  },
  {
    title: "Ignoring safety guidelines",
    body: "Ignoring safety puts you and others at risk. Read our Safety Guidelines. Listen to guides. Stay on marked trails.",
  },
  {
    title: "Not acclimatizing",
    body: "Ignoring altitude sickness can be dangerous. Ascend gradually. Watch for symptoms: headache, nausea, dizziness. Descend immediately if symptoms worsen.",
  },
];

const glossary = [
  {
    term: "Trek Leader",
    definition:
      "An experienced guide who leads the group, manages logistics, ensures safety, and makes decisions about pace and route adjustments.",
  },
  {
    term: "Grade or Level",
    definition:
      "A trek’s difficulty rating based on terrain, altitude, duration, and technical requirements.",
  },
  {
    term: "Acclimatization",
    definition:
      "The process of adjusting your body to higher altitudes. Spend a day at intermediate altitude before ascending further to prevent altitude sickness.",
  },
  {
    term: "Base Camp",
    definition:
      "The main campsite from which trekkers start their ascent. It serves as a staging point for higher elevations and typically has basic facilities.",
  },
  {
    term: "Elevation Gain",
    definition:
      "The total vertical distance you climb during a trek. Measured in meters or feet, it determines the difficulty level of the route.",
  },
  {
    term: "Switchback",
    definition:
      "A zigzag trail pattern used to ascend steep terrain. Instead of going straight up, the trail switches back and forth to reduce the gradient.",
  },
  {
    term: "Treeline",
    definition:
      "The altitude above which trees cannot grow. Beyond this point, terrain is typically rocky with sparse vegetation and more exposure to elements.",
  },
  {
    term: "Blister",
    definition:
      "A fluid-filled bubble caused by friction. Prevention: proper footwear, moisture-wicking socks, and breaking in boots before the trek.",
  },
  {
    term: "Altitude Sickness",
    definition:
      "A condition caused by ascending too quickly. Symptoms include headache, nausea, and dizziness. Descend immediately if symptoms worsen.",
  },
];

const faqs = [
  {
    question:
      "How long does it take to see results from trekking training?",
    answer:
      "Generally, you will start feeling more energetic and capable within 2–3 weeks of consistent training. However, for a noticeable improvement in cardiovascular endurance and leg strength, 4–6 weeks of training is highly recommended.",
  },
  {
    question: "I’m scared of heights. Can I still trek?",
    answer:
      "Yes! Many beginners have fear of heights. Choose lower-altitude treks and inform your guide. Most beginner-friendly trails don’t involve exposed edges. Visit our Trek Calendar to find suitable options.",
  },
  {
    question: "What should I do if I get tired during the trek?",
    answer:
      "Communicate with your trek leader immediately. Take short, frequent breaks, hydrate, and maintain a slow, steady pace. Remember, it’s not a race! Our guides are trained to adjust the pace to suit everyone in the group.",
  },
  {
    question: "Can I trek alone as a beginner?",
    answer:
      "We highly recommend beginners join an organized group with experienced guides. Group treks provide safety, support, logistical ease, and a great community experience.",
  },
  {
    question: "What is the best season for beginner treks?",
    answer:
      "Post-monsoon (October–November) and pre-summer (March–April) are ideal. Clear skies, moderate temperatures, and stable weather make these seasons perfect for first-timers.",
  },
  {
    question: "How do I choose between camping and tea house treks?",
    answer:
      "Tea house treks offer basic accommodation and meals along the route. Camping treks are more adventurous but require more gear. For beginners, tea house treks are generally more comfortable and convenient.",
  },
];

const resources = [
  {
    title: "Fitness Requirements",
    description: "Training benchmarks and how to prepare your body.",
    href: "/guides/fitness-requirements",
  },
  {
    title: "Safety Guidelines",
    description: "Our protocols, emergency response, and on-trail rules.",
    href: "/guides/safety-guidelines",
  },
  {
    title: "Responsible Travel",
    description: "Leave-no-trace practices and local etiquette.",
    href: "/guides/responsible-travel",
  },
  {
    title: "Cancellation Policy",
    description: "Booking changes, transfers, and refunds.",
    href: "/cancellation-policy",
  },
];

const linkClass =
  "font-medium text-ink underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary";

function Section({ id, title, intro, children }) {
  return (
    <section
      id={id}
      className="mt-12 scroll-mt-28 border-t border-line/70 pt-10 sm:mt-16 sm:pt-12"
    >
      <h2 className="text-2xl font-bold leading-tight text-ink sm:text-[28px]">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-gray-600">
          {intro}
        </p>
      )}
      {children}
    </section>
  );
}

export default function BeginnerTrekGuidePage() {
  const phoneHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;

  return (
    <>
      <PageHero
        title="Beginner Trek Guide"
        crumb="Beginner Trek Guide"
        subtitle="A practical, no-jargon guide to choosing your first route, avoiding the classic mistakes, and walking into the hills with confidence."
      />

      <BeginnerGuideNav />

      <div className="bg-page pb-20 pt-10 sm:pb-24 sm:pt-14">
        <div className="container-px mx-auto max-w-3xl">
          {/* ── Intro ─────────────────────────────────────────────────── */}
          <p className="text-[15px] leading-7 text-gray-600">
            New to trekking? This guide covers everything you need to know before
            your first trek, from choosing the right route to packing smart and
            staying safe on the trail.
          </p>

          <dl className="mt-6 grid gap-x-[32px] gap-y-[16px] border-y border-line/70 py-6 sm:grid-cols-2">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[13px] text-gray-500">{fact.label}</dt>
                <dd className="mt-[2px] text-sm font-medium text-ink">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[15px] leading-7 text-gray-600">
            Ready to pick a date?{" "}
            <Link href="/treks" className={linkClass}>
              Browse upcoming treks
            </Link>{" "}
            or{" "}
            <Link href="/travel-calendar" className={linkClass}>
              view the trek calendar
            </Link>
            .
          </p>

          {/* ── Choosing your first trek ──────────────────────────────── */}
          <Section
            id="choosing-your-first-trek"
            title="Choosing Your First Trek"
            intro="Selecting the right trek is the most important decision you will make as a beginner. Here is what to look for when picking your first adventure."
          >
            <div className="mt-8 space-y-6">
              {firstTreks.map((trek, index) => (
                <div
                  key={trek.title}
                  className="grid gap-[6px] sm:grid-cols-[2rem_1fr] sm:gap-[16px]"
                >
                  <span className="text-[13px] font-medium tabular-nums text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug text-ink">
                      {trek.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-7 text-gray-600">
                      {trek.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Common beginner mistakes ──────────────────────────────── */}
          <Section
            id="common-beginner-mistakes"
            title="Common Beginner Mistakes"
            intro="Learn from others’ experiences. Here are the most frequent errors new trekkers make and how to avoid them."
          >
            <dl className="mt-8 divide-y divide-line/70 border-y border-line/70">
              {mistakes.map((mistake, index) => (
                <div
                  key={mistake.title}
                  className="grid gap-[6px] py-[18px] sm:grid-cols-[2rem_1fr] sm:gap-[16px]"
                >
                  <span className="text-[13px] font-medium tabular-nums text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <dt className="font-semibold leading-snug text-ink">
                      {mistake.title}
                    </dt>
                    <dd className="mt-1 text-[15px] leading-7 text-gray-600">
                      {mistake.body}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Section>

          {/* ── Glossary ──────────────────────────────────────────────── */}
          <Section
            id="trekking-glossary"
            title="Trekking Glossary"
            intro="New to trekking terms? Here are the essential words every beginner should know before hitting the trail."
          >
            <dl className="mt-8 grid gap-x-[40px] gap-y-6 sm:grid-cols-2">
              {glossary.map((item) => (
                <div key={item.term}>
                  <dt className="font-semibold leading-snug text-ink">
                    {item.term}
                  </dt>
                  <dd className="mt-1 text-[15px] leading-7 text-gray-600">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* ── FAQ ───────────────────────────────────────────────────── */}
          <Section
            id="your-questions-answered"
            title="Your Questions, Answered"
            intro="Got questions? Here are answers to the most common concerns from first-time trekkers."
          >
            <div className="mt-8 border-t border-line/70">
              {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-line/70">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-[16px] py-[16px] [&::-webkit-details-marker]:hidden">
                    <span className="text-[15px] font-semibold leading-6 text-ink">
                      {faq.question}
                    </span>
                    <i
                      className="bi bi-plus mt-0.5 shrink-0 text-ink/50 transition-transform duration-200 group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="pb-[16px] pr-10 text-[15px] leading-7 text-gray-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Section>

          {/* ── Before you go ─────────────────────────────────────────── */}
          <Section
            id="before-you-go"
            title="Before You Go"
            intro="Four short reads to make sure you are prepared once you have picked a trek."
          >
            <ul className="mt-8 divide-y divide-line/70 border-y border-line/70">
              {resources.map((resource) => (
                <li key={resource.title}>
                  <Link
                    href={resource.href}
                    className="group flex items-center justify-between gap-[16px] py-[14px]"
                  >
                    <span>
                      <span className="block font-semibold text-ink transition-colors group-hover:text-primary">
                        {resource.title}
                      </span>
                      <span className="mt-[2px] block text-sm leading-6 text-gray-500">
                        {resource.description}
                      </span>
                    </span>
                    <i
                      className="bi bi-arrow-right shrink-0 text-ink/40 transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          {/* ── Contact ───────────────────────────────────────────────── */}
          <Section
            id="contact"
            title="Still unsure where to start?"
            intro="Tell us your dates, fitness level, and what you want from the experience. We will help you pick the right first trek — no pressure, no jargon."
          >
            <p className="mt-4 text-[15px] leading-7 text-gray-600">
              Call{" "}
              <a href={phoneHref} className={linkClass}>
                {site.phone}
              </a>
              , message us on{" "}
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp
              </a>
              , or email{" "}
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
