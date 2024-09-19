import { expect, test } from '../fixtures/fixtures'

const startTime = Date.now()

test.describe('@samples', () => {
  test('attachment test example', async ({ info }) => {
    info.attach('Start Time', new Date(startTime).toString())
    expect(Date.now()).toBeGreaterThan(startTime)
  })

  test('flaky test example', async ({ po, info }) => {
    await po.home.navigate()
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
})
