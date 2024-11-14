import { expect, test } from '../utils/extended-test-fixtures'

test.describe('@navigation', () => {
  test('logo looks okay', async ({ po }) => {
    await po.home.navigateToPage()
    await expect(po.home.navBar.logo).toHaveScreenshot('logo.png')
  })

  test('nav items are visible', async ({ po }) => {
    await po.home.navigateToPage()
    await po.home.navBar.verifyNavigationItemsAreVisible()
  })

  test('items under Node.js are okay', async ({ po }) => {
    const items = [
      { lang: 'Node.js', url: '' },
      { lang: 'Python', url: 'python' },
      { lang: 'Java', url: 'java' },
      { lang: '.NET', url: 'dotnet' },
    ]
    await po.home.navigateToPage()
    for (const item of items) {
      await po.home.switchLanguageTo(item)
    }
  })
})
