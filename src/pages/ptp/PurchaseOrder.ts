import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { control } from '../../ui5/ControlProxy';
import { waitForMessage } from '../../ui5/waits';
import { logger } from '../../utils/logger';

export class PurchaseOrderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async createHeader(vendor: string, purchOrg: string, purchGroup: string) {
    await this.waitReady();
    await this.fillField('Vendor', vendor);
    await this.fillField('Purchasing Organization', purchOrg);
    await this.fillField('Purchasing Group', purchGroup);
    logger.step('PO header filled');
  }

  async addItem(material: string, quantity: string, plant?: string) {
    await this.waitReady();
    try {
      const addBtn = await control(this.page, {
        controlType: 'sap.m.Button',
        properties: { text: /Add|Create|Insert/i },
      });
      await addBtn.press();
    } catch {
      await this.page.getByRole('button', { name: /Add|Create|Insert/i }).first().click();
      await this.waitReady();
    }
    await this.fillField('Material', material);
    await this.fillField('Quantity', quantity);
    if (plant) await this.fillField('Plant', plant);
    logger.step('PO item added');
  }

  async save() {
    await this.waitReady();
    try {
      const saveBtn = await control(this.page, {
        controlType: 'sap.m.Button',
        properties: { text: /Save|Create|Post/i },
      });
      await saveBtn.press();
    } catch {
      await this.page.getByRole('button', { name: /Save|Create|Post/i }).first().click();
      await this.waitReady();
    }
    logger.step('PO save pressed');
  }

  async getDocumentNumber(): Promise<string | null> {
    try {
      const text = await waitForMessage(this.page, undefined, 15_000);
      const match = text.match(/\d{8,}/);
      return match ? match[0] : null;
    } catch {
      return null;
    }
  }
}
