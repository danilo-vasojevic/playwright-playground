import { expect, test } from '../utils/extended-test-fixtures'

const startTime = Date.now()

test.describe('@samples', () => {
  test('attachment test example', async ({ info }) => {
    info.attach('Start Time', new Date(startTime).toString())
    expect(Date.now()).toBeGreaterThan(startTime)
  })

  test('flaky test example', async ({ po, info }) => {
    await po.home.navigateToPage()
    await test.step('Skip test if browser is Firefox or WebKit', async () => {
      info.skipBrowser('firefox')
      info.skipBrowser('webkit')
    })
    if (!info.testInfo.retry)
      expect(true).toEqual(false)
  })

  test('geolocation test example', async ({ po, info }) => {
    expect(info.testInfo.project.use.permissions).toContain('geolocation')
    const configLongitude = info.testInfo.project.use.geolocation!.longitude
    const configLatitude = info.testInfo.project.use.geolocation!.latitude

    await po.page.goto('https://gps-coordinates.org/')
    await expect(po.page.locator('#latitude')).toHaveValue(`${configLatitude}`)
    await expect(po.page.locator('#longitude')).toHaveValue(`${configLongitude}`)
  })

  test('Click on button located by image', async ({ po }) => {
    test.skip(!!process.env.CI, 'This will not work in CI until I figure out how to install python etc.')
    await po.home.navigateToPage()
    await po.home.verifyUrl()
    await po.home.clickImage('GetStarted')
    await expect(po.page).toHaveURL(/intro/)
    await expect(po.page.locator('h1')).toHaveText('Installation')
  })
})
