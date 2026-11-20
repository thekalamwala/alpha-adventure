"use client";

import { useLayoutEffect, useRef } from "react";

export default function ProgrammePageBody({ html }) {
  const body = useRef(null);

  useLayoutEffect(() => {
    const page = body.current;
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    const updateHeight = () => {
      page.style.setProperty("--site-header-height", `${header.getBoundingClientRect().height}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return <div ref={body} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
