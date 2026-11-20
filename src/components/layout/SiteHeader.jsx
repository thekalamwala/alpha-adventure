import fs from "fs";
import path from "path";
import { escapeHtml } from "@/lib/html";
import { isPublicSupabaseConfigured } from "@/lib/seo";
import { GROUP_ALIASES } from "@/lib/sections";
import { getTours } from "@/lib/tourListing";
import { getHomeTreks } from "@/lib/trekListing";

const topbarHtml = fs.readFileSync(
  path.join(process.cwd(), "src/data/orig-topbar.html"),
  "utf8"
);
const headerHtml = fs.readFileSync(
  path.join(process.cwd(), "src/data/orig-header.html"),
  "utf8"
);

const panel = (title, href, items) => ({ title, href, items });
const fallbackImage = "/assets/img/innerpages/breadcrumb-bg1.jpg";

function renderMenu(title, href, panels) {
  const tabs = panels.length > 1 ? `<div class="mega-col mega-cats">${panels.map((p, index) =>
    `<a href="${escapeHtml(p.href)}" class="mega-cat-link${index === 0 ? " active" : ""}" data-target="${href.slice(1)}-menu-${index}">
      <i class="bi bi-geo-alt"></i> ${escapeHtml(p.title)}
    </a>`).join("")}</div>` : "";

  return `<li class="mega-trigger">
    <a href="${href}" class="drop-down">${title} <i class="bi bi-caret-down-fill"></i></a>
    <div class="aa-mega-panel" data-mega="${href.slice(1)}">
      ${tabs}
      <div class="mega-col mega-items">
        ${panels.map((p, index) => `<div class="mega-sub-panel${index === 0 ? " active" : ""}" id="${href.slice(1)}-menu-${index}">
          <div class="mega-panel-heading"><h5>${escapeHtml(p.title)}</h5><div class="mega-accent-bar"></div></div>
          <div class="mega-dest-grid">${p.items.slice(0, 4).map((item) => {
            const image = item.image && /^(?:https:\/\/|\/(?![\/\\]))/i.test(item.image) ? item.image : fallbackImage;
            return `<a href="${escapeHtml(item.href)}" class="mega-dest-card">
              <img loading="lazy" decoding="async" src="${escapeHtml(image)}" alt="" class="mega-dest-thumb">
              <div class="mega-dest-info">
                <span class="mega-dest-name">${escapeHtml(item.title)}</span>
                ${item.location || item.duration ? `<span class="mega-dest-brief">${escapeHtml(item.location || item.duration)}</span>` : ""}
              </div>
              <span class="mega-dest-arrow" aria-hidden="true">&rarr;</span>
            </a>`;
          }).join("")}</div>
          <a href="${escapeHtml(p.href)}" class="mega-panel-cta">View all ${escapeHtml(p.title)} <span aria-hidden="true">&rarr;</span></a>
        </div>`).join("")}
      </div>
    </div>
  </li>`;
}

export default async function SiteHeader() {
  const [treks, tours] = isPublicSupabaseConfigured
    ? await Promise.all([getHomeTreks(Infinity), getTours()])
    : [[], []];
  const upcoming = treks.filter((trek) => trek.href.startsWith("/treks/"));
  const backpacking = treks.filter((trek) => trek.group === "backpacking");
  const nearby = treks.filter((trek) => trek.group === "near-nagpur");
  const trekPanels = Object.entries(GROUP_ALIASES).map(([slug, group]) => {
    const title = slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
    return panel(title, `/treks/${slug}`, upcoming.filter((trek) => trek.group === group));
  });
  const statePanels = [...new Set(backpacking.map((trek) => trek.state?.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .map((state) => panel(state, "/backpacking-trips", backpacking.filter((trek) => trek.state?.trim() === state)));
  const tourCards = tours.map((tour) => ({ ...tour, href: `/tour-packages/${encodeURIComponent(tour.slug)}` }));
  const menus = [
    renderMenu("Upcoming Treks", "/treks", [panel("Upcoming Treks", "/treks", upcoming), ...trekPanels.filter((p) => p.items.length)]),
    renderMenu("Backpacking Trips", "/backpacking-trips", [panel("Backpacking Trips", "/backpacking-trips", backpacking), ...statePanels]),
    renderMenu("Trips Near Nagpur", "/trips-near-nagpur", [panel("Trips Near Nagpur", "/trips-near-nagpur", nearby)]),
    renderMenu("Tour Packages", "/tour-packages", ["Domestic", "International"].map((type) =>
      panel(`${type} Tour Packages`, "/tour-packages", tourCards.filter((tour) => tour.type === type)))),
  ].join("");

  return (
    <div
      data-site-header
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: topbarHtml + headerHtml.replace("<!-- CATALOGUE_MENUS -->", () => menus) }}
    />
  );
}
