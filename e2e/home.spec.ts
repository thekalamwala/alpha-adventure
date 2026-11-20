import { test, expect } from "@playwright/test";

// Phase 1 smoke: proves the app boots and key public routes render.
// Richer journey coverage (enquiry, booking, admin) lands in later phases.

test("homepage loads", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/Alpha Adventures/);
});

test("contact page renders the enquiry form", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#contactForm")).toBeVisible();
});
