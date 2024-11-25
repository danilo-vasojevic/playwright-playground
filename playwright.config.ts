import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'

// Add environment variables from file
// See https://github.com/motdotla/dotenv
process.env.ENV = process.env.ENV ? process.env.ENV : 'default' // Which .env file to read
dotenv.config({ path: `config/${process.env.ENV}.env` }) // Read .env
export const BASE_URL = process.env.BASE_URL
const DEFAULT_PERMISSIONS = process.env.DEFAULT_PERMISSIONS!.split(',')

// Configuration for entire Playwright project
// See https://playwright.dev/docs/test-configuration
export default defineConfig({
  maxFailures: 10, // Maximum number of test failures before stopping execution
  timeout: 30000, // Timeout for each test in milliseconds
  testDir: './tests', // Directory where Playwright looks for tests
  snapshotPathTemplate: 'data/{testFileName}/{arg}{ext}', // Where to generate / look for snapshots
  fullyParallel: true, // Run tests in files in parallel
  forbidOnly: !!process.env.CI, // Fail the build on CI if you accidentally left test.only in the source code
  retries: process.env.CI ? 1 : 1, // Retry on CI only
  workers: process.env.CI ? 4 : 8, // Opt out of parallel tests on CI
  outputDir: 'output/', // Folder for test artifacts such as screenshots, videos, traces, etc
  reporter: process.env.CI // Reporter to use. See https://playwright.dev/docs/test-reporters
    ? /*  CI   */[['list'], ['blob'], ['junit', { outputFile: 'results.xml' }]]
    : /* Local */[['list'], ['html', { open: 'on-failure' }]],

  // Shared settings for all the projects
  // See https://playwright.dev/docs/api/class-testoptions
  use: {
    acceptDownloads: true, // Accepts all downloads
    actionTimeout: 5000, // No action can take longer than 5 seconds
    baseURL: BASE_URL, // Base URL to use in actions like `await page.goto('/')`
    geolocation: { longitude: 19.997393, latitude: 43.275428 },
    permissions: DEFAULT_PERMISSIONS, // Used in all projects
    headless: true, // Run tests in headless mode
    screenshot: 'only-on-failure', // Capture screenshots on test failure
    trace: 'on-first-retry', // Collect trace when retrying the failed test
    video: 'on-first-retry', // Collect video when retrying the failed test
    viewport: { width: 1920, height: 1080 }, // Viewport resolution to use
  },

  webServer: !process.env.CI // Webserver will be started by CI on CI
    ? {
        command: 'python services/iconLocatorService.py',
        url: 'http://127.0.0.1:5000',
        reuseExistingServer: !process.env.CI,
        stderr: 'ignore',
        stdout: 'ignore',
      }
    : undefined,

  // Default config for assertions
  // See https://playwright.dev/docs/test-configuration#expect-options
  expect: {
    timeout: 5000, // Maximum time expect() should wait for the condition to be met
    toHaveScreenshot: {
      animations: 'disabled', // Disables animations when comparing screenshots
      caret: 'hide', // Hides red text caret when comparing screenshots
      scale: 'css', //
      threshold: 0.2, // How different colors can be (comparing in YIQ color space)
      maxDiffPixelRatio: 0.01,
      maxDiffPixels: 1000,
    },
  },

  // Configure projects for major browsers
  // See https://playwright.dev/docs/api/class-testproject
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        permissions: [...new Set([ // To avoid duplication
          ...DEFAULT_PERMISSIONS, // Combine global add new permissions
          ...['clipboard-read', 'clipboard-write', 'geolocation'],
        ])],
      },
    },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        permissions: ['geolocation'], // Override global permissions
      },
    },
  ],
})
