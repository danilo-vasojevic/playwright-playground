import type { Page } from 'playwright'
import { test as base } from '@playwright/test'
import { PageObject } from '../page-object/page-object'
import { ExtendedTestInfo } from '../utils/extended-test-info'

interface Fixtures {
  info: ExtendedTestInfo
  pg: Page
  po: PageObject
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  info: async ({}, use, testInfo) => await use(new ExtendedTestInfo(testInfo)),
  pg: async ({ page }, use) => {
    await page.goto('/') // Before each test using `pg`
    await use(page)
    await page.close() // After each test using `pg`
  },
  po: async ({ page }, use) => {
    const pageObject = new PageObject(page)
    await use(pageObject)
    await page.close()
  },
})

export { expect } from '@playwright/test'
