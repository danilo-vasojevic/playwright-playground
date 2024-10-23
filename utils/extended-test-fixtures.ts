import type { Page } from '@playwright/test'
import { test as pwTest } from '@playwright/test'
import { PageObject } from '../page-object/page-object'
import { ExtendedTestInfo } from './extended-test-info'

export { expect } from '@playwright/test'
export const test = pwTest.extend<{
  info: ExtendedTestInfo
  pg: Page
  po: PageObject
}>({
  // eslint-disable-next-line no-empty-pattern
  info: async ({ }, use, testInfo) => await use(new ExtendedTestInfo(testInfo)),
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
