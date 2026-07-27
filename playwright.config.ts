import process from 'node:process'

import { defineConfig, devices } from '@playwright/test'

// https://playwright.dev/docs/test-configuration
//
// Browser binaries: on NixOS the devenv shell exports PLAYWRIGHT_BROWSERS_PATH
// pointing at pkgs.playwright-driver.browsers, so @playwright/test is pinned to
// the exact nixpkgs version (browser revisions are matched per release). On CI
// neither var is set and `playwright install --with-deps` works normally — no
// branching needed here.
export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // `reporter` is intentionally omitted: Playwright defaults to 'list' locally and
  // 'dot' on CI. The old hardcoded 'html' opened a report server after every local run.
  use: {
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    trace: 'on-first-retry',
    // `headless` defaults to true; use `pnpm exec playwright test --headed` to debug.
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    // dev server locally for a fast feedback loop; preview on CI for realism.
    // On CI you must run `pnpm build-only` before `pnpm test:e2e`.
    command: process.env.CI ? 'pnpm run preview' : 'pnpm run dev',
    url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
