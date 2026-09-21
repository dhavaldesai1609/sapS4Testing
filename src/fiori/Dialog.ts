/**
 * Dialog / Popover / MessageBox helpers.
 */
import { Page, expect } from '@playwright/test';
import { control } from '../ui5/ControlProxy';
import { waitForUI5Stable } from '../ui5/waits';

export class DialogHelper {
  constructor(private readonly page: Page) {}

  async waitForOpen(timeout = 15_000): Promise<void> {
    await this.page
      .locator('.sapMDialog, .sapMPopover, .sapMMessageBox, [role="dialog"]')
      .first()
      .waitFor({ state: 'visible', timeout });
    await waitForUI5Stable(this.page);
  }

  async confirm(buttonText: string | RegExp = /OK|Yes|Confirm|Save/i): Promise<void> {
    await this.waitForOpen();
    const btn = await control(this.page, {
      controlType: 'sap.m.Button',
      properties: { text: buttonText },
      searchOpenDialogs: true,
    });
    await btn.press();
    await waitForUI5Stable(this.page);
  }

  async cancel(buttonText: string | RegExp = /Cancel|No|Close/i): Promise<void> {
    await this.waitForOpen();
    const btn = await control(this.page, {
      controlType: 'sap.m.Button',
      properties: { text: buttonText },
      searchOpenDialogs: true,
    });
    await btn.press();
    await waitForUI5Stable(this.page);
  }

  async getTitle(): Promise<string> {
    const title = this.page.locator('.sapMDialogTitle, .sapMTitle, [class*="Dialog"] .sapMTitle').first();
    return (await title.innerText()).trim();
  }

  async expectTitle(expected: string | RegExp): Promise<void> {
    await expect.poll(async () => this.getTitle()).toMatch(expected);
  }

  async fillInDialog(label: string, value: string): Promise<void> {
    await this.waitForOpen();
    try {
      const input = await control(this.page, {
        controlType: 'sap.m.Input',
        properties: { placeholder: new RegExp(label, 'i') },
        searchOpenDialogs: true,
      });
      await input.setValue(value);
    } catch {
      const field = this.page.locator('[role="dialog"]').getByLabel(new RegExp(label, 'i')).first();
      await field.fill(value);
      await waitForUI5Stable(this.page);
    }
  }
}
