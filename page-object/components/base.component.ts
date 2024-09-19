import type { Locator, Page } from '@playwright/test'
import type { LocatorOptions } from '../../utils/locator.types'

export abstract class BaseComponent {
  protected page: Page
  public component: Locator
  constructor(
    page: Page,
    baseLocator: string,
    parent?: Locator,
    options?: LocatorOptions,
  ) {
    this.page = page
    if (parent)
      this.component = parent.locator(baseLocator, options)
    else this.component = page.locator(baseLocator, options)
  }
}
