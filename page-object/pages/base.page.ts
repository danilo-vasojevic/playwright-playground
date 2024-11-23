import type { Page } from '@playwright/test'
import { expect, request, test } from '@playwright/test'
import { BASE_URL } from '../../playwright.config'
import { Step } from '../../utils/step-decorator'

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
  @Step() async navigateToPage() {
    await test.step(`Navigate to page: ${this.url}`, async () => {
      if (this.partialUrl === undefined)
        throw new Error('Cant navigate. Page Url not set.')
      await this.page.goto(this.partialUrl)
    })
  }

  @Step() async verifyUrl() {
    await test.step(`Verify page URL is: ${this.url}`, async () => {
      await expect(this.page).toHaveURL(this.url)
    })
  }

  @Step('Draw red circle on coordinates: [{position.x}, {position.y}]')
  async drawCircle(position: { x: number, y: number }) {
    await this.page.evaluate(({ x, y }) => {
      const circle = document.createElement('div')
      circle.style.position = 'absolute'
      circle.style.left = `${x - 10}px`
      circle.style.top = `${y - 10}px`
      circle.style.width = `${10 * 2}px`
      circle.style.height = `${10 * 2}px`
      circle.style.borderRadius = '50%'
      circle.style.backgroundColor = 'red'
      circle.style.zIndex = '9999' // Ensure it's on top
      document.body.appendChild(circle)
    }, position)
  }

  @Step('Locate element coordinates: "{iconName}"')
  async locateElementViaImage(iconName: string): Promise<{ x: number, y: number }> {
    const buffer = await this.page.screenshot({ path: 'output/screenshot.png' })
    const size = this.page.viewportSize()
    const api = await request.newContext()
    const response: any = await api.post('http://127.0.0.1:5000/locate', {
      multipart: {
        file: {
          name: 'screenshot.png',
          mimeType: 'image/png',
          buffer,
        },
        iconName,
      },
    })
    const responseJson = await response.json()
    const position = {
      x: Math.round(responseJson.x * size!.width),
      y: Math.round(responseJson.y * size!.height),
    }
    return position
  }

  @Step('Click element located by image: {iconName}')
  async clickImage(iconName: string) {
    const position = await this.locateElementViaImage(iconName)
    await this.page.click('body', { position })
    // await this.drawCircle(position) // Used to show where click will be dropped, debugging mostly
  }
}
