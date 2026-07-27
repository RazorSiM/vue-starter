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
    await expect(page.getByRole('cell', { name: 'Ada Lovelace', exact: true })).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(5)
  })

  test('filters rows through the table global filter', async ({ page }) => {
    await expect(page.locator('tbody tr')).toHaveCount(5)

    await page.getByLabel('Filter members').fill('designer')

    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(page.getByRole('cell', { name: 'Jony Ive', exact: true })).toBeVisible()
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
    await expect(page.getByRole('cell', { name: 'Barbara Liskov', exact: true })).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(6)
  })

  test('surfaces the zod message for an invalid email', async ({ page }) => {
    await page.getByLabel('email').fill('not-an-email')
    await page.getByLabel('email').blur()

    await expect(page.getByText('That does not look like an email address')).toBeVisible()
  })

  // Reka UI's contribution is behaviour a unit test in jsdom can only approximate:
  // focus trapping, focus restoration and Escape handling need a real browser.
  test('confirms a removal, restores focus on Escape, then removes on confirm', async ({
    page,
  }) => {
    // Every row's button used to be named just "remove"; the aria-label says which
    // member it removes, which is the only way a screen reader can tell them apart.
    const trigger = page.getByRole('button', { name: 'Remove Ada Lovelace' })
    await trigger.click()

    const dialog = page.getByRole('alertdialog')
    await expect(dialog).toBeVisible()
    // The name comes from AlertDialogTitle via aria-labelledby, wired by Reka.
    await expect(dialog).toHaveAccessibleName('Remove Ada Lovelace?')

    // Focus is inside the dialog, not left behind on the page underneath it.
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    // Focus returns to the trigger that opened it — the part hand-rolled dialogs
    // forget, which strands keyboard users at the top of the document.
    await expect(trigger).toBeFocused()
    await expect(page.locator('tbody tr')).toHaveCount(5)

    await trigger.click()
    await page.getByRole('alertdialog').getByRole('button', { name: 'Remove' }).click()

    await expect(page.getByRole('cell', { name: 'Ada Lovelace', exact: true })).toBeHidden()
    await expect(page.locator('tbody tr')).toHaveCount(4)
  })

  test('describes each nav link with the file that produced it', async ({ page }) => {
    const link = page.getByRole('link', { name: 'demo', exact: true })
    await link.focus()

    // This was a `title` attribute, which never opens on keyboard focus. The tooltip
    // is wired to the link with aria-describedby, so it is announced as a description.
    await expect(link).toHaveAccessibleDescription('src/pages/demo.vue')
  })

  test('picks a role through the radio group with the keyboard alone', async ({ page }) => {
    const group = page.getByRole('radiogroup', { name: 'role' })

    await expect(group.getByRole('radio', { name: 'engineer' })).toBeChecked()

    // One tab stop for the group, arrows to move inside it. Tabbing to it lands on the
    // checked option rather than on the first one.
    await page.getByLabel('email').fill('grace@example.com')
    await page.getByLabel('email').press('Tab')
    await expect(group.getByRole('radio', { name: 'engineer' })).toBeFocused()

    // `delay` is load-bearing, not flake insurance. Reka moves focus on keydown and
    // then checks the newly focused radio from a setTimeout(0) guarded by a flag its
    // keyup handler clears. A zero-delay synthetic press releases the key before that
    // timeout runs, so focus moves and nothing gets checked. Any human holds a key for
    // longer than a tick; 50ms reproduces that.
    await page.keyboard.press('ArrowRight', { delay: 50 })
    await expect(group.getByRole('radio', { name: 'designer' })).toBeChecked()
    await expect(group.getByRole('radio', { name: 'engineer' })).not.toBeChecked()

    await page.getByLabel('name').fill('Grace Hopper')
    await page.getByRole('button', { name: 'Add member' }).click()

    await expect(page.getByRole('cell', { name: 'Grace Hopper', exact: true })).toBeVisible()
    await expect(
      page.getByRole('row', { name: /Grace Hopper/ }).getByRole('cell', { name: 'designer' }),
    ).toBeVisible()
  })

  test('shows the error state and recovers on retry', async ({ page }) => {
    await page.getByLabel('simulate a 500').check()

    await expect(page.getByText('failed with 500')).toBeVisible()

    await page.getByLabel('simulate a 500').uncheck()

    // Unchecking moves back to the cached happy-path query key, so the rows return.
    await expect(page.getByRole('cell', { name: 'Ada Lovelace', exact: true })).toBeVisible()
  })
})
