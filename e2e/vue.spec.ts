import { expect, test } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('div.markdown-body > h1')).toHaveText('Vue 3 Starter')
})

// The docs page imports docs/reference.md — the only Markdown source outside the
// repo root, and outside src/ entirely. If that path or the Markdown plugin's
// `include` ever stops covering it, the route renders empty rather than failing
// the build, so assert the content actually arrived.
test('renders the reference docs from outside src/', async ({ page }) => {
  await page.goto('/docs')
  await expect(page.locator('div.markdown-body > h1')).toHaveText('Reference')
  await expect(page.getByRole('heading', { name: 'The data layer', level: 2 })).toBeVisible()
})
