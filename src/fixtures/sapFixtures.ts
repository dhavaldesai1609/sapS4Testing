/**
 * Playwright fixtures for SAP S/4HANA automation.
 * Import { test, expect } from this module in specs.
 */
import { test as base, expect } from '@playwright/test';
import { control, controls, UI5ControlProxy } from '../ui5/ControlProxy';
import type { ControlQuery, InteractionStrategy } from '../ui5/types';
import { waitForUI5Stable, waitForMessage, waitForControl } from '../ui5/waits';
import { ListReport } from '../fiori/ListReport';
import { ObjectPage } from '../fiori/ObjectPage';
import { DialogHelper } from '../fiori/Dialog';
import { TableHelper } from '../fiori/Table';
import { ValueHelpHelper } from '../fiori/ValueHelp';
import { FioriShell } from '../fiori/Shell';
import { navigateToApp } from '../utils/navigation';

type UI5Fixture = {
  control: (query: ControlQuery, strategy?: InteractionStrategy) => Promise<UI5ControlProxy>;
  controls: (query: ControlQuery, strategy?: InteractionStrategy) => Promise<UI5ControlProxy[]>;
  waitForUI5: (opts?: { timeout?: number; waitForNetwork?: boolean }) => Promise<void>;
  waitForMessage: (contains?: string | RegExp, timeout?: number) => Promise<string>;
  waitForControl: (pred: { id?: string; controlType?: string; text?: string }, timeout?: number) => Promise<void>;
  fill: (query: ControlQuery, value: string) => Promise<void>;
  press: (query: ControlQuery) => Promise<void>;
};

type FioriFixture = {
  listReport: ListReport;
  objectPage: ObjectPage;
  dialog: DialogHelper;
  table: TableHelper;
  valueHelp: ValueHelpHelper;
  shell: FioriShell;
  navigateToApp: (appTitleOrIntent: string) => Promise<void>;
};

export const test = base.extend<UI5Fixture & FioriFixture>({
  control: async ({ page }, use) => {
    await use((query, strategy) => control(page, query, strategy));
  },
  controls: async ({ page }, use) => {
    await use((query, strategy) => controls(page, query, strategy));
  },
  waitForUI5: async ({ page }, use) => {
    await use((opts) => waitForUI5Stable(page, opts));
  },
  waitForMessage: async ({ page }, use) => {
    await use((contains, timeout) => waitForMessage(page, contains, timeout));
  },
  waitForControl: async ({ page }, use) => {
    await use((pred, timeout) => waitForControl(page, pred, timeout));
  },
  fill: async ({ page }, use) => {
    await use(async (query, value) => {
      const c = await control(page, query);
      await c.setValue(value);
    });
  },
  press: async ({ page }, use) => {
    await use(async (query) => {
      const c = await control(page, query);
      await c.press();
    });
  },
  listReport: async ({ page }, use) => {
    await use(new ListReport(page));
  },
  objectPage: async ({ page }, use) => {
    await use(new ObjectPage(page));
  },
  dialog: async ({ page }, use) => {
    await use(new DialogHelper(page));
  },
  table: async ({ page }, use) => {
    await use(new TableHelper(page));
  },
  valueHelp: async ({ page }, use) => {
    await use(new ValueHelpHelper(page));
  },
  shell: async ({ page }, use) => {
    await use(new FioriShell(page));
  },
  navigateToApp: async ({ page }, use) => {
    await use((app) => navigateToApp(page, app));
  },
});

export { expect };
