import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { NavBarComponent } from '../components/navBar.component'
import { BasePage } from './base.page'

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page, '/')
  }

  // Components
  navBar = new NavBarComponent(this.page, 'nav[aria-label="Main"]')

  // Locators
  getStarted = this.page.getByRole('link', { name: 'Get started' })
  paragraphTitles = this.page.locator('//h3[text()]')

  // Actions
  async verifyParagraphTitles(opts: { titles: string[] }) {
    for (const title of opts.titles) {
      await expect(this.paragraphTitles.getByText(title)).toBeVisible()
    }
  }
}
