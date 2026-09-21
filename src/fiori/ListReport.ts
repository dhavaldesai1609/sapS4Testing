/**
 * Fiori Elements – List Report helpers (filter bar, table, create, navigation).
 */
import { Page, expect } from '@playwright/test';
import { control } from '../ui5/ControlProxy';
import { waitForUI5Stable } from '../ui5/waits';

export class ListReport {
  constructor(private readonly page: Page) {}

  async setFilter(labelOrName: string, value: string): Promise<void> {
    await waitForUI5Stable(this.page);
    try {
      const input = await control(this.page, {
        controlType: 'sap.m.Input',
        properties: { placeholder: new RegExp(labelOrName, 'i') },
      });
      await input.setValue(value);
    } catch {
      try {
        const input = await control(this.page, {
          controlType: 'sap.m.Input',
          properties: { name: new RegExp(labelOrName, 'i') },
        });
        await input.setValue(value);
      } catch {
        const field = this.page
          .getByLabel(new RegExp(labelOrName, 'i'))
          .or(this.page.getByPlaceholder(new RegExp(labelOrName, 'i')))
          .first();
        await field.fill(value);
        await waitForUI5Stable(this.page);
      }
    }
  }

  async go(): Promise<void> {
    await waitForUI5Stable(this.page);
    const goBtn = await control(this.page, {
      controlType: 'sap.m.Button',
      properties: { text: /Go|Search|Apply/i },
    });
    await goBtn.press();
    await waitForUI5Stable(this.page, { waitForNetwork: true });
  }

  async search(): Promise<void> {
    await this.go();
  }

  async pressCreate(): Promise<void> {
    const btn = await control(this.page, {
      controlType: 'sap.m.Button',
      properties: { text: /Create|New|\\+/i },
    });
    await btn.press();
    await waitForUI5Stable(this.page);
  }

  async navigateToRow(index = 0): Promise<void> {
    await waitForUI5Stable(this.page);
    const rows = this.page.locator('.sapMListTblRow, .sapUiTableRow, tr[data-sap-ui], .sapMCLC');
    await rows.nth(index).click();
    await waitForUI5Stable(this.page, { waitForNetwork: true });
  }

  async getRowCount(): Promise<number> {
    await waitForUI5Stable(this.page);
    return this.page.locator('.sapMListTblRow, .sapUiTableRow:not(.sapUiTableHeaderRow)').count();
  }

  async expectRowCount(min: number): Promise<void> {
    await expect.poll(async () => this.getRowCount()).toBeGreaterThanOrEqual(min);
  }
}
