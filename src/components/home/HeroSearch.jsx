"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Progressive enhancement for the static hero search in orig-home.html.
// The homepage is a static HTML blob, so we can't render React into it — instead
// we hook the existing markup after mount: turn the trek box into a live typeahead
// over REAL published treks (fetched from /api/treks/search), make results click
// through to the trek, and make SEARCH / submit go to /search?q=. The dead
// date/room template fields are hidden. If the markup isn't present, it no-ops.
export default function HeroSearch() {
  const router = useRouter();

  useEffect(() => {
    const form = document.querySelector("form.filter-input.show");
    if (!form) return;

    const input = form.querySelector(".custom-select-search-area input");
    const list = form.querySelector(".option-list-destination");
    const searchBtn = form.querySelector("button.primary-btn1, .primary-btn1");

    // Hide the non-functional template fields (date / room) so the search reads clean.
    form.querySelectorAll(".single-search-box.date-field, .single-search-box.room-field").forEach((el) => {
      el.style.display = "none";
    });

    const esc = (s) =>
      String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

    let treks = [];
    const render = (q) => {
      if (!list) return;
      const ql = (q || "").trim().toLowerCase();
      const matches = (ql
        ? treks.filter((t) => t.title.toLowerCase().includes(ql) || (t.location || "").toLowerCase().includes(ql))
        : treks
      ).slice(0, 10);
      list.innerHTML = matches.length
        ? matches
            .map(
              (t) =>
                `<li data-href="${esc(t.href)}" style="cursor:pointer"><div class="destination"><h6>${esc(t.title)}</h6><span>${esc(t.location)}</span></div><div class="tour"><span>View</span></div></li>`,
            )
            .join("")
        : `<li><div class="destination"><h6>No matches</h6><span>Try another name or place</span></div></li>`;
    };

    fetch("/api/treks/search")
      .then((r) => r.json())
      .then((d) => { treks = d.treks || []; render(input ? input.value : ""); })
      .catch(() => {});

    const go = (q) => router.push(`/search?q=${encodeURIComponent((q || "").trim())}`);

    const onInput = (e) => render(e.target.value);
    const onListClick = (e) => {
      const li = e.target.closest("li[data-href]");
      if (li) { e.preventDefault(); router.push(li.getAttribute("data-href")); }
    };
    const onSubmit = (e) => { e.preventDefault(); go(input ? input.value : ""); };
    const onBtn = (e) => { e.preventDefault(); go(input ? input.value : ""); };

    input?.addEventListener("input", onInput);
    list?.addEventListener("click", onListClick);
    form.addEventListener("submit", onSubmit);
    searchBtn?.addEventListener("click", onBtn);

    return () => {
      input?.removeEventListener("input", onInput);
      list?.removeEventListener("click", onListClick);
      form.removeEventListener("submit", onSubmit);
      searchBtn?.removeEventListener("click", onBtn);
    };
  }, [router]);

  return null;
}
