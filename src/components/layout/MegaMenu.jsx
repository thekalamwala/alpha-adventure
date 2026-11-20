"use client";

import { useEffect } from "react";

// Delegate so the tabs still work when a catalogue refresh replaces the header HTML.
export default function MegaMenu() {
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 991px)");
    const activate = ({ target }) => {
      const link = target.closest?.(".mega-cat-link[data-target]");
      const panel = link?.closest(".aa-mega-panel");
      if (!panel || mobile.matches || link.classList.contains("active")) return;

      panel.querySelectorAll(".mega-cat-link").forEach((tab) => tab.classList.toggle("active", tab === link));
      panel.querySelectorAll(".mega-sub-panel").forEach((group) => group.classList.toggle("active", group.id === link.dataset.target));
    };

    document.addEventListener("mouseover", activate);
    document.addEventListener("focusin", activate);
    return () => {
      document.removeEventListener("mouseover", activate);
      document.removeEventListener("focusin", activate);
    };
  }, []);

  return null;
}
