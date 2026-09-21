import { Page, Locator, expect } from '@playwright/test';
import { waitForUI5Stable } from '../utils/ui5';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async waitReady(timeout = 30_000) {
    await waitForUI5Stable(this.page, timeout);
  }

  async clickByText(text: string) {
    await this.waitReady();
    await this.page.getByRole('button', { name: text }).or(this.page.getByText(text, { exact: true })).first().click();
    await this.waitReady();
  }

  async fillField(labelOrPlaceholder: string, value: string) {
    await this.waitReady();
    const field = this.page.getByLabel(labelOrPlaceholder)
      .or(this.page.getByPlaceholder(labelOrPlaceholder))
      .or(this.page.locator(`[title="${labelOrPlaceholder}"] input, [aria-label="${labelOrPlaceholder}"]`))
      .first();
    await field.fill(value);
  }

  async expectSuccessMessage(contains?: string) {
    const msg = this.page.locator('.sapMMessageToast, .sapMMsgStrip, [class*="MessageToast"], [class*="success"]');
    await expect(msg.first()).toBeVisible({ timeout: 15_000 });
    if (contains) {
      await expect(msg.first()).toContainText(contains);
    }
  }
}
