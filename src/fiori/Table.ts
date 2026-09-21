/**
 * Table helpers for sap.m.Table, sap.ui.table.Table, SmartTable, MDC Table.
 */
import { Page, expect } from '@playwright/test';
import { waitForUI5Stable } from '../ui5/waits';

export class TableHelper {
  constructor(private readonly page: Page) {}

  private rowSelector =
    '.sapMListTblRow, .sapUiTableRow:not(.sapUiTableHeaderRow), tr.sapMListTblRow, .sapMCLC';

  async rowCount(): Promise<number> {
    await waitForUI5Stable(this.page);
    return this.page.locator(this.rowSelector).count();
  }

  async getCellText(rowIndex: number, colIndex: number): Promise<string> {
    await waitForUI5Stable(this.page);
    const row = this.page.locator(this.rowSelector).nth(rowIndex);
    const cell = row.locator('td, .sapMListTblCell, .sapUiTableCell').nth(colIndex);
    return (await cell.innerText()).trim();
  }

  async selectRow(rowIndex: number): Promise<void> {
    await waitForUI5Stable(this.page);
    const row = this.page.locator(this.rowSelector).nth(rowIndex);
    const cb = row.locator('input[type="checkbox"], .sapMCb');
    if (await cb.count()) {
      await cb.first().click();
    } else {
      await row.click();
    }
    await waitForUI5Stable(this.page);
  }

  async clickRow(rowIndex: number): Promise<void> {
    await waitForUI5Stable(this.page);
    await this.page.locator(this.rowSelector).nth(rowIndex).click();
    await waitForUI5Stable(this.page, { waitForNetwork: true });
  }

  async findRowByText(text: string | RegExp): Promise<number> {
    await waitForUI5Stable(this.page);
    const rows = this.page.locator(this.rowSelector);
    const count = await rows.count();
    const re = typeof text === 'string' ? new RegExp(text, 'i') : text;
    for (let i = 0; i < count; i++) {
      const t = await rows.nth(i).innerText();
      if (re.test(t)) return i;
    }
    return -1;
  }

  async expectContainsText(text: string | RegExp): Promise<void> {
    const idx = await this.findRowByText(text);
    expect(idx, `Row containing ${text} not found`).toBeGreaterThanOrEqual(0);
  }

  async sortByColumn(columnHeader: string): Promise<void> {
    await waitForUI5Stable(this.page);
    const header = this.page
      .locator(`.sapMListTblHeaderCell:has-text("${columnHeader}"), .sapUiTableColHdr:has-text("${columnHeader}"), th:has-text("${columnHeader}")`)
      .first();
    await header.click();
    await waitForUI5Stable(this.page);
  }
}
