import { expect, test } from '@playwright/test'

// Unlike the unit tests, which drive MSW through its Node server, these exercise the
// real service worker in a real browser. If public/mockServiceWorker.js is missing or
// stale, this suite is what notices.

test.describe('demo page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo')

    // Every test gets a fresh browser context, so every test pays the cold-start cost
    // in full: registering the service worker, pulling the MSW bundle, then the 400ms
    // the handler sleeps. Under `fullyParallel` against a dev server that is still
    // compiling, that overruns the 5s expect default — which is a slow boot, not a
    // broken app. Absorb it here, once, instead of raising expect.timeout globally
    // and blunting every other assertion in the suite.
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 20_000 })
  })

  test('renders the seeded members once the query resolves', async ({ page }) => {
    await expect(page.getByRole('cell', { name: 'Ada Lovelace' })).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(5)
  })

  test('filters rows through the table global filter', async ({ page }) => {
    await expect(page.locator('tbody tr')).toHaveCount(5)

    await page.getByLabel('Filter members').fill('designer')

    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(page.getByRole('cell', { name: 'Jony Ive' })).toBeVisible()
  })

  test('sorts by a column when its header is clicked', async ({ page }) => {
    await expect(page.locator('tbody tr')).toHaveCount(5)

    // Numeric columns sort descending on the first click — vue-table defaults
    // `sortDescFirst` to true for numbers, on the theory that "top N" is what you
    // usually want from a number. Strings still go ascending first.
    await page.getByRole('button', { name: 'commits' }).click()
    await expect(page.locator('tbody tr').first()).toContainText('Linus Torvalds')

    await page.getByRole('button', { name: 'commits' }).click()
    await expect(page.locator('tbody tr').first()).toContainText('Julie Zhuo')
  })

  test('adds a member and shows it after the cache is invalidated', async ({ page }) => {
    await page.getByLabel('name').fill('Barbara Liskov')
    await page.getByLabel('email').fill('barbara@example.com')
    await page.getByRole('button', { name: 'Add member' }).click()

    // The POST resolves, the members query is invalidated, the refetch lands.
    await expect(page.getByRole('cell', { name: 'Barbara Liskov' })).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(6)
  })

  test('surfaces the zod message for an invalid email', async ({ page }) => {
    await page.getByLabel('email').fill('not-an-email')
    await page.getByLabel('email').blur()

    await expect(page.getByText('That does not look like an email address')).toBeVisible()
  })

  test('shows the error state and recovers on retry', async ({ page }) => {
    await page.getByLabel('simulate a 500').check()

    await expect(page.getByText('failed with 500')).toBeVisible()

    await page.getByLabel('simulate a 500').uncheck()

    // Unchecking moves back to the cached happy-path query key, so the rows return.
    await expect(page.getByRole('cell', { name: 'Ada Lovelace' })).toBeVisible()
  })
})
