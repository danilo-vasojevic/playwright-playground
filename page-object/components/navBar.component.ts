import { BaseComponent } from './base.component'
import { Locator, Page, expect, test } from '@playwright/test'

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

  // Actions
  async verifyNavItems() {
    await test.step('Verify naviation items are visible', async () => {
      await expect(this.docs).toBeVisible()
      await expect(this.api).toBeVisible()
      await expect(this.langPicker).toBeVisible()
      await expect(this.community).toBeVisible()

      await expect(this.gitHubLink).toBeVisible()
      await expect(this.discordLink).toBeVisible()
      await expect(this.themeToggle).toBeVisible()
      await expect(this.search).toBeVisible()
    })
  }

  getDropdownItem(item: string): Locator {
    return this.dropdownItems.getByText(item)
  }
}
