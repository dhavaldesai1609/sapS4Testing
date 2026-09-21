/**
 * Fiori Elements – Object Page helpers (sections, edit, save, footer actions).
 */
import { Page } from '@playwright/test';
import { control } from '../ui5/ControlProxy';
import { waitForUI5Stable, waitForMessage } from '../ui5/waits';

export class ObjectPage {
  constructor(private readonly page: Page) {}

  async edit(): Promise<void> {
    const btn = await control(this.page, {
      controlType: 'sap.m.Button',
      properties: { text: /Edit/i },
    });
    await btn.press();
    await waitForUI5Stable(this.page);
  }

  async save(): Promise<void> {
    const btn = await control(this.page, {
      controlType: 'sap.m.Button',
      properties: { text: /Save|Create|Apply/i },
    });
    await btn.press();
    await waitForUI5Stable(this.page, { waitForNetwork: true });
  }

  async cancel(): Promise<void> {
    const btn = await control(this.page, {
      controlType: 'sap.m.Button',
      properties: { text: /Cancel|Close/i },
    });
    await btn.press();
    await waitForUI5Stable(this.page);
  }

  async openSection(title: string): Promise<void> {
    await waitForUI5Stable(this.page);
    const section = this.page.locator(
      `.sapUxAPObjectPageSection:has-text("${title}"), [title="${title}"], button:has-text("${title}")`
    ).first();
    await section.click();
    await waitForUI5Stable(this.page);
  }

  async fillField(label: string, value: string): Promise<void> {
    await waitForUI5Stable(this.page);
    try {
      const input = await control(this.page, {
        controlType: 'sap.m.Input',
        properties: { placeholder: new RegExp(label, 'i') },
      });
      await input.setValue(value);
    } catch {
      const field = this.page.getByLabel(new RegExp(label, 'i')).first();
      await field.fill(value);
      await waitForUI5Stable(this.page);
    }
  }

  async expectSuccess(contains?: string): Promise<string> {
    return waitForMessage(this.page, contains);
  }
}
