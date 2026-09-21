import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { navigateToApp, waitForUI5Stable } from '../utils/ui5';

export class FioriLaunchpad extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openApp(appName: string) {
    await navigateToApp(this.page, appName);
  }

  async goHome() {
    await waitForUI5Stable(this.page);
    const home = this.page.locator('#shell-header-logo, [title="Home"], button[aria-label*="Home"]').first();
    if (await home.isVisible().catch(() => false)) {
      await home.click();
      await waitForUI5Stable(this.page);
    }
  }
}
