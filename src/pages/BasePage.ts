import { Page } from '@playwright/test';
import { waitForUI5Stable, waitForMessage } from '../ui5/waits';
import { control } from '../ui5/ControlProxy';
import type { ControlQuery } from '../ui5/types';
import { logger } from '../utils/logger';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async waitReady(timeout = 30_000) {
    await waitForUI5Stable(this.page, { timeout });
  }

  async clickByText(text: string | RegExp) {
    await this.waitReady();
    try {
      const btn = await control(this.page, {
        controlType: 'sap.m.Button',
        properties: { text },
      });
      await btn.press();
    } catch {
      await this.page.getByRole('button', { name: text }).first().click();
      await this.waitReady();
    }
  }

  async fillField(labelOrPlaceholder: string, value: string) {
    await this.waitReady();
    try {
      const input = await control(this.page, {
        controlType: 'sap.m.Input',
        properties: { placeholder: new RegExp(labelOrPlaceholder, 'i') },
      });
      await input.setValue(value);
    } catch {
      try {
        const input = await control(this.page, {
          controlType: 'sap.m.Input',
          properties: { name: new RegExp(labelOrPlaceholder, 'i') },
        });
        await input.setValue(value);
      } catch {
        const field = this.page
          .getByLabel(new RegExp(labelOrPlaceholder, 'i'))
          .or(this.page.getByPlaceholder(new RegExp(labelOrPlaceholder, 'i')))
          .first();
        await field.fill(value);
        await this.waitReady();
      }
    }
    logger.debug('Filled field', { label: labelOrPlaceholder, value });
  }

  async pressControl(query: ControlQuery) {
    const c = await control(this.page, query);
    await c.press();
  }

  async expectSuccessMessage(contains?: string | RegExp) {
    return waitForMessage(this.page, contains);
  }
}
