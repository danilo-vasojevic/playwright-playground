import { expect, test } from '../fixtures/fixtures'

test.describe('@homepage', () => {
  test('has title', async ({ po }) => {
    await po.home.navigate()
    await po.home.verifyUrl()
  })

  test('get started link works', async ({ po }) => {
    await po.home.navigate()
    await po.home.getStarted.click()
    await expect(po.page).toHaveURL('/docs/intro')
  })

  test('paragraph titles are correct', async ({ po }) => {
    await po.home.navigate()
    await po.home.verifyParagraphTitles({
      titles: [
        'Any browser • Any platform • One API',
        'Resilient • No flaky tests',
        'No trade-offs • No limits',
        'Full isolation • Fast execution',
        'Powerful Tooling',
      ],
    })
  })
})
