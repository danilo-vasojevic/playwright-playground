import type { Page } from '@playwright/test'
import { HomePage } from './pages/home.page'

export class PageObject {
  page: Page
  home: HomePage

  constructor(page: Page) {
    this.page = page

    // Initialize all page objects
    this.home = new HomePage(this.page)
  }
}
