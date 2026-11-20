import { defineConfig } from "@playwright/test";

// E2E smoke suite. Runs in CI (browsers installed there); locally run
// `npx playwright install chromium` first. baseURL matches the dev server.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The legacy asset bundle is large and first-time dev compiles are slow on
  // low-memory machines, so give navigations plenty of headroom. Specs wait on
  // "domcontentloaded" (DOM parsed) rather than the full "load" event (every
  // image/font), which is all a smoke check needs.
  timeout: 90_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    navigationTimeout: 60_000,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
