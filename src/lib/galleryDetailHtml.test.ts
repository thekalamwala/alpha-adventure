import { describe, it, expect } from "vitest";
import { galleryDetailHtml } from "./galleryDetailHtml";

// Audit M1: DB-sourced album fields must be HTML-escaped before injection.
describe("galleryDetailHtml escaping", () => {
  const page = {
    slug: "x",
    title: `<img src=x onerror="alert(1)">`,
    hero: `"><script>alert(1)</script>`,
    heroAlt: `a" onmouseover="alert(1)`,
    seasons: [],
  };
  const html = galleryDetailHtml(page);

  it("does not emit the raw script/img breakout from the title", () => {
    expect(html).not.toContain("<img src=x onerror=");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;img src=x onerror=");
  });

  it("escapes quotes in attribute context (hero/heroAlt)", () => {
    expect(html).not.toContain(`alt="a" onmouseover="alert(1)"`);
    expect(html).toContain("&quot;");
  });
});

describe("seasonal gallery photos", () => {
  const photo = { src: "/assets/monsoon.jpg", alt: "Monsoon trail" };
  const page = {
    slug: "test-trek",
    title: "Test trek",
    hero: "/assets/hero.jpg",
    heroAlt: "Test trek",
    seasons: [
      { id: "summer", label: "Summer", icon: "bi-sun", sub: "", images: [] },
      { id: "monsoon", label: "Monsoon", icon: "bi-cloud-rain", sub: "", images: [photo] },
    ],
  };

  it("opens the first season with photos and leaves empty seasons accessible", () => {
    const html = galleryDetailHtml(page);
    expect(html).toContain('class="gd-tab active" data-season="monsoon"');
    expect(html).toContain('class="gd-panel active" id="panel-monsoon"');
    expect(html).toContain('src="/assets/monsoon.jpg" alt="Monsoon trail"');
    expect(html).toContain("No photos for summer yet.");
    expect(html).not.toContain("View All Monsoon Photos");
  });

  it("offers View All when a season has more than eight photos", () => {
    const html = galleryDetailHtml({
      ...page,
      seasons: [{ ...page.seasons[1], images: Array(9).fill(photo) }],
    });
    expect(html).toContain('class="gd-item gd-hidden" data-index="8"');
    expect(html).toContain("View All Monsoon Photos");
  });
});
