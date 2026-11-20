"use client";

import { useEffect, useRef, useState } from "react";
import { readTrekHighlight } from "@/lib/trekHighlights";

const cardBackgrounds = [
  "repeating-radial-gradient(ellipse at 81% 26%, transparent 0 23px, #edf8e91c 24px 25px, transparent 26px 38px), linear-gradient(145deg, #214d3f, #0a241e 72%)",
  "repeating-radial-gradient(ellipse at 72% -23%, transparent 0 26px, #edf8e91f 27px 28px, transparent 29px 43px), linear-gradient(145deg, #175d58, #0a2622 70%)",
];

function cardContent(item) {
  const { title, subtext } = readTrekHighlight(item);
  const label = title.match(/^(Day|Night)\s+\d+(?=\s*[:–—])/i)?.[0];
  const heading = label ? title.slice(label.length).replace(/^\s*[:–—]\s*/, "") : title;
  return { label, title: heading, description: subtext };
}

function updateEdges(track, setAtStart, setAtEnd) {
  setAtStart(track.scrollLeft <= 2);
  setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
}

// Horizontal card slider for the trek "Not to Miss" items. Plain overflow
// scroll-snap so it needs no Swiper instance; arrows scroll by one card.
export default function NotToMissSlider({ items = [] }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const sync = () => updateEdges(track, setAtStart, setAtEnd);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => observer.disconnect();
  }, [items.length]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap) : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous"
            className="grid h-9 w-9 place-items-center rounded-full border border-line/70 text-ink transition hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Next"
            className="grid h-9 w-9 place-items-center rounded-full border border-line/70 text-ink transition hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <i className="bi bi-chevron-right" />
          </button>
      </div>

      <div
        ref={trackRef}
        onScroll={(event) => updateEdges(event.currentTarget, setAtStart, setAtEnd)}
        className="flex snap-x snap-mandatory gap-[16px] overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const { label, title, description } = cardContent(item);
          return (
            <article
              key={i}
              data-card
              className="flex min-h-[190px] min-w-0 shrink-0 basis-[min(82%,320px)] snap-start flex-col justify-center break-words rounded-[24px] border border-white/10 p-5 sm:basis-[min(calc(50%-0.5rem),340px)] sm:p-6"
              style={{ backgroundImage: cardBackgrounds[i % cardBackgrounds.length] }}
            >
              {label && <span className="mb-2 self-start rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">{label}</span>}
              <h5 className="m-0 text-xl font-bold leading-tight text-[#f7f7e9] sm:text-2xl">{title}</h5>
              {description && <p className="mb-0 mt-2 whitespace-pre-line text-sm leading-relaxed text-[#dbe7dd]">{description}</p>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
