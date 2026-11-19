"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { id: "choosing-your-first-trek", label: "Choosing a Trek" },
  { id: "common-beginner-mistakes", label: "Mistakes" },
  { id: "trekking-glossary", label: "Glossary" },
  { id: "your-questions-answered", label: "FAQ" },
  { id: "before-you-go", label: "Before You Go" },
];

// Plain sticky section nav. Keeps the active section underlined and scrolls the
// bar horizontally on small screens.
export default function BeginnerGuideNav() {
  const [active, setActive] = useState(links[0].id);
  const navRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);
    if (!sections.length) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = 120;
      let current = sections[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= offset) current = section;
      }

      // Near the bottom of the page the last section may never cross the
      // offset line, so make sure it can still become active.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8
      ) {
        current = sections[sections.length - 1];
      }

      setActive(current.id);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const activeLink = bar.querySelector(`[data-id="${active}"]`);
    if (!activeLink) return;

    const left =
      activeLink.offsetLeft - (bar.clientWidth - activeLink.clientWidth) / 2;
    bar.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  // The site layout sets <base href="/">, so a plain fragment href would resolve
  // to "/#section" and leave the page entirely. Scroll manually instead.
  const handleClick = (event, id) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;

    const offset = (navRef.current?.offsetHeight ?? 0) + 24;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${id}`
    );
    setActive(id);
  };

  return (
    <nav
      ref={navRef}
      aria-label="On this page"
      className="sticky top-0 z-40 border-b border-line/70 bg-white"
    >
      <div className="container-px mx-auto max-w-3xl">
        <div
          ref={barRef}
          className="flex gap-[24px] overflow-x-auto py-[12px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                data-id={link.id}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => handleClick(event, link.id)}
                className={`shrink-0 whitespace-nowrap border-b-2 pb-[2px] pt-[2px] text-[13px] font-medium transition-colors ${
                  isActive
                    ? "border-primary text-ink"
                    : "border-transparent text-gray-500 hover:text-ink"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
