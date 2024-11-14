import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { Step } from '../../utils/step-decorator'
import { BaseComponent } from './base.component'

export class NavBarComponent extends BaseComponent {
  constructor(page: Page, baseLocator: string) {
    super(page, baseLocator)
  }

  // Locators
  homeLink = this.component.locator('a.navbar__brand')
  logo = this.component.getByAltText('Playwright logo')
  docs = this.component.locator('a.navbar__item', { hasText: 'Docs' })
  api = this.component.locator('a.navbar__item', { hasText: 'API' })
  community = this.component.locator('a.navbar__item', { hasText: 'community' })

  langPicker = this.component.locator('div.navbar__item.dropdown--hoverable')
  dropdownMenu = this.langPicker.locator('ul.dropdown__menu')
  dropdownItems = this.dropdownMenu.locator('li')

  gitHubLink = this.component.locator('a.header-github-link')
  discordLink = this.component.locator('a.header-discord-link')
  themeToggle = this.component.locator('//div[contains(@class, "colorModeToggle")]')
  search = this.component.locator('button[aria-label="Search"]')
  dropdownItem = (item: string) => this.dropdownItems.getByText(item)

  // Actions
  @Step() async verifyNavigationItemsAreVisible() {
    await expect(this.docs).toBeVisible()
    await expect(this.api).toBeVisible()
    await expect(this.langPicker).toBeVisible()
    await expect(this.community).toBeVisible()
    await expect(this.gitHubLink).toBeVisible()
    await expect(this.discordLink).toBeVisible()
    await expect(this.themeToggle).toBeVisible()
    await expect(this.search).toBeVisible()
  }
}
