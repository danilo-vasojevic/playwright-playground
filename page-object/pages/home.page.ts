import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BASE_URL } from '../../playwright.config'
import { Step } from '../../utils/step-decorator'
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
  @Step('Verify paragraph titles: {0.titles}')
  async verifyParagraphTitles(opts: { titles: string[] }) {
    for (const title of opts.titles) {
      await expect(this.paragraphTitles.getByText(title)).toBeVisible()
    }
  }

  @Step('Switch language to: {0.lang} with partial url {0.url}')
  async switchLanguageTo(item: { lang: string, url: string }) {
    await this.navBar.langPicker.hover()
    await this.navBar.dropdownItem(item.lang).click()
    await expect(this.page).toHaveURL(new RegExp(`.*${BASE_URL}/${item.url}.*`))
  }
}
