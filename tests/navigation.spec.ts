import { expect, test } from '../fixtures/fixtures'
import { BASE_URL } from '../playwright.config'

test.describe('@navigation', () => {
  test('logo looks okay', async ({ po }) => {
    await po.home.navigate()
    await expect(po.home.navBar.logo).toHaveScreenshot('logo.png')
  })

  test('nav items are visible', async ({ po }) => {
    await po.home.navigate()
    await po.home.navBar.verifyNavItems()
  })

  test('items under Node.js are okay', async ({ po }) => {
    const items = [
      { lang: 'Node.js', url: '' },
      { lang: 'Python', url: 'python' },
      { lang: 'Java', url: 'java' },
      { lang: '.NET', url: 'dotnet' },
    ]
    await po.home.navigate()
    for (const item of items) {
      await test.step(`Switch language to ${item.lang}`, async () => {
        await po.home.navBar.langPicker.hover()
        await po.home.navBar.getDropdownItem(item.lang).click()
        await expect(po.page).toHaveURL(new RegExp(`.*${BASE_URL}/${item.url}.*`))
      })
    }
  })
})
