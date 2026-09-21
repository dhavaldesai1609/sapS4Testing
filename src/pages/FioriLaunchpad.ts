import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { FioriShell } from '../fiori/Shell';
import { navigateToApp, navigateByIntent } from '../utils/navigation';

export class FioriLaunchpad extends BasePage {
  readonly shell: FioriShell;

  constructor(page: Page) {
    super(page);
    this.shell = new FioriShell(page);
  }

  async openApp(appName: string) {
    await navigateToApp(this.page, appName);
  }

  async openByIntent(semanticObject: string, action: string, params?: Record<string, string>) {
    await navigateByIntent(this.page, semanticObject, action, params);
  }

  async goHome() {
    await this.shell.goHome();
  }

  async expectLoaded() {
    await this.shell.expectLoaded();
  }
}
