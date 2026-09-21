/**
 * Fiori Launchpad shell utilities (home, search, user menu, notifications).
 */
import { Page, expect } from '@playwright/test';
import { waitForUI5Stable } from '../ui5/waits';
import { navigateToApp } from '../utils/navigation';

export class FioriShell {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await waitForUI5Stable(this.page);
    await expect(
      this.page.locator('.sapUshellShell, #shell-header, [id*="shell"]').first()
    ).toBeVisible({ timeout: 60_000 });
  }

  async goHome(): Promise<void> {
    await waitForUI5Stable(this.page);
    const home = this.page
      .locator('#shell-header-logo, [title="Home"], button[aria-label*="Home"], .sapUshellShellHeadItm')
      .first();
    if (await home.isVisible().catch(() => false)) {
      await home.click();
      await waitForUI5Stable(this.page);
    }
  }

  async openApp(appTitleOrIntent: string): Promise<void> {
    await navigateToApp(this.page, appTitleOrIntent);
  }

  async search(term: string): Promise<void> {
    await waitForUI5Stable(this.page);
    const search = this.page.locator(
      '#shell-header-search-field, input[placeholder*="Search"], .sapUshellSearchField input'
    ).first();
    await search.click();
    await search.fill(term);
    await this.page.keyboard.press('Enter');
    await waitForUI5Stable(this.page);
  }

  async openUserMenu(): Promise<void> {
    await waitForUI5Stable(this.page);
    const me = this.page.locator(
      '#meAreaHeaderButton, [title*="Profile"], [aria-label*="Profile"], .sapUshellShellHeadItm[title*="User"]'
    ).first();
    await me.click();
    await waitForUI5Stable(this.page);
  }

  async signOut(): Promise<void> {
    await this.openUserMenu();
    const signOut = this.page.getByText(/Sign Out|Log Out|Logoff/i).first();
    await signOut.click();
  }
}
