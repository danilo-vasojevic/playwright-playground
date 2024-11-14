import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { BASE_URL } from '../../playwright.config'

export abstract class BasePage {
  page: Page
  private partialUrl: string | undefined
  private url: string
  constructor(page: Page, url: string) {
    this.page = page
    this.partialUrl = url
    this.url = `${BASE_URL}${this.partialUrl}`
  }

  // Actions
  async navigate() {
    await test.step(`Navigate to page: ${this.url}`, async () => {
      if (this.partialUrl === undefined)
        throw new Error('Cant navigate. Page Url not set.')
      await this.page.goto(this.partialUrl)
    })
  }

  async verifyUrl() {
    test.step(`Verify page URL is: ${this.url}`, async () => {
      await expect(this.page).toHaveURL(this.url)
    })
  }
}
