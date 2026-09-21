import { test, expect } from '@playwright/test';
import { FioriLaunchpad } from '../../src/pages/FioriLaunchpad';
import { waitForUI5Stable } from '../../src/utils/ui5';

test.describe('Common – Fiori Launchpad', () => {
  test('Launchpad loads and shell is visible @smoke', async ({ page }) => {
    await waitForUI5Stable(page);
    await expect(page.locator('.sapUshellShell, #shell-header, [id*="shell"]').first()).toBeVisible();
  });

  test('Can return to home', async ({ page }) => {
    const flp = new FioriLaunchpad(page);
    await flp.goHome();
    await expect(page.locator('.sapUshellShell, #shell-header').first()).toBeVisible();
  });
});
