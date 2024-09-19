import type { TestInfo } from '@playwright/test'

export class ExtendedTestInfo {
  readonly testInfo: TestInfo

  constructor(testInfo: TestInfo) {
    this.testInfo = testInfo
  }

  attach(type: string, description: string) {
    this.testInfo.annotations.push({ type, description })
    return this
  }

  skip(reason: string): ExtendedTestInfo {
    this.testInfo.skip(true, reason)
    return this
  }

  skipIf(condition: boolean, reason: string): ExtendedTestInfo {
    this.testInfo.skip(condition, reason)
    return this
  }

  skipBrowser(browserName: 'chromium' | 'firefox' | 'webkit') {
    this.skipIf(this.testInfo.project.name === browserName, `Won't run on ${browserName}`)
  }
}
