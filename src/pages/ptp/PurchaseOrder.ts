import { Page, expect } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * Example Page Object for Manage Purchase Orders / Create Purchase Order
 * Adapt selectors to the exact tiles and controls in the Manitoba Hydro landscape.
 */
export class PurchaseOrderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async createHeader(vendor: string, purchOrg: string, purchGroup: string) {
    await this.waitReady();
    await this.fillField('Vendor', vendor);
    await this.fillField('Purchasing Organization', purchOrg);
    await this.fillField('Purchasing Group', purchGroup);
  }

  async addItem(material: string, quantity: string, plant?: string) {
    await this.waitReady();
    const addBtn = this.page.getByRole('button', { name: /Add|Create|Insert/i }).first();
    if (await addBtn.isVisible().catch(() => false)) {
      await addBtn.click();
      await this.waitReady();
    }
    await this.fillField('Material', material);
    await this.fillField('Quantity', quantity);
    if (plant) await this.fillField('Plant', plant);
  }

  async save() {
    await this.waitReady();
    await this.page.getByRole('button', { name: /Save|Create|Post/i }).first().click();
    await this.waitReady();
  }

  async getDocumentNumber(): Promise<string | null> {
    const toast = this.page.locator('.sapMMessageToast, [class*="MessageToast"]');
    if (await toast.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const text = await toast.innerText();
      const match = text.match(/\d{8,}/);
      return match ? match[0] : null;
    }
    return null;
  }
}
