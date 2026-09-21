/**
 * Value Help / F4 / SmartField value help dialog helpers.
 */
import { Page } from '@playwright/test';
import { control } from '../ui5/ControlProxy';
import { waitForUI5Stable } from '../ui5/waits';
import { DialogHelper } from './Dialog';

export class ValueHelpHelper {
  constructor(private readonly page: Page) {}

  async openFromField(labelOrPlaceholder: string): Promise<void> {
    await waitForUI5Stable(this.page);
    const field = this.page
      .getByLabel(new RegExp(labelOrPlaceholder, 'i'))
      .or(this.page.getByPlaceholder(new RegExp(labelOrPlaceholder, 'i')))
      .first();
    const container = field.locator('xpath=ancestor::*[contains(@class,"sapMInput") or contains(@class,"sapUiComp")][1]');
    const vh = container.locator('.sapMInputBaseIcon, [title*="Value Help"], [aria-label*="Value Help"], .sapUiIcon').first();
    if (await vh.isVisible().catch(() => false)) {
      await vh.click();
    } else {
      await field.click({ position: { x: 5, y: 5 } });
      await this.page.keyboard.press('F4');
    }
    await waitForUI5Stable(this.page);
    await new DialogHelper(this.page).waitForOpen();
  }

  async search(term: string): Promise<void> {
    await waitForUI5Stable(this.page);
    try {
      const search = await control(this.page, {
        controlType: 'sap.m.SearchField',
        searchOpenDialogs: true,
      });
      await search.setValue(term);
      await this.page.keyboard.press('Enter');
    } catch {
      const input = this.page.locator('[role="dialog"] input').first();
      await input.fill(term);
      await this.page.keyboard.press('Enter');
    }
    await waitForUI5Stable(this.page, { waitForNetwork: true });
  }

  async selectRow(index = 0): Promise<void> {
    const rows = this.page.locator(
      '[role="dialog"] .sapMListTblRow, [role="dialog"] .sapUiTableRow, [role="dialog"] tr'
    );
    await rows.nth(index).click();
    await waitForUI5Stable(this.page);
  }

  async confirm(): Promise<void> {
    await new DialogHelper(this.page).confirm(/OK|Select|Continue/i);
  }

  async pick(fieldLabel: string, searchTerm: string, rowIndex = 0): Promise<void> {
    await this.openFromField(fieldLabel);
    await this.search(searchTerm);
    await this.selectRow(rowIndex);
    await this.confirm();
  }
}
