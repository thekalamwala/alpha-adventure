"use client";

import { useEffect } from "react";

// Delegate so the tabs still work when a catalogue refresh replaces the header HTML.
export default function MegaMenu() {
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 991px)");
    const positionPanel = (trigger) => {
      if (!trigger || mobile.matches) return;
      const panel = trigger.querySelector(".aa-mega-panel");
      if (!panel) return;

      const { left, width } = trigger.getBoundingClientRect();
      const center = left + width / 2;
      const viewport = document.documentElement.clientWidth;
      const gutter = 28;
      const centeredWidth = 2 * (Math.min(center, viewport - center) - gutter);
      const panelWidth = Math.min(700, Math.max(600, centeredWidth), viewport - 2 * gutter);
      const edgeClearance = panelWidth / 2 + gutter;
      const boundedCenter = Math.min(viewport - edgeClearance, Math.max(edgeClearance, center));
      panel.style.setProperty("--mega-panel-width", `${panelWidth}px`);
      panel.style.setProperty("--mega-panel-offset", `${boundedCenter - center}px`);
    };
    const activate = ({ target }) => {
      if (!target.closest?.(".aa-mega-panel")) positionPanel(target.closest?.(".mega-trigger"));
      const link = target.closest?.(".mega-cat-link[data-target]");
      const panel = link?.closest(".aa-mega-panel");
      if (!panel || mobile.matches || link.classList.contains("active")) return;

      panel.querySelectorAll(".mega-cat-link").forEach((tab) => tab.classList.toggle("active", tab === link));
      panel.querySelectorAll(".mega-sub-panel").forEach((group) => group.classList.toggle("active", group.id === link.dataset.target));
    };

    const onResize = () => positionPanel(document.querySelector(".mega-trigger:hover"));
    onResize();
    document.addEventListener("mouseover", activate);
    document.addEventListener("focusin", activate);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mouseover", activate);
      document.removeEventListener("focusin", activate);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
