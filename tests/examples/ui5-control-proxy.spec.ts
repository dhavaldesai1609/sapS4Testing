import { test, expect } from '../../src/fixtures/sapFixtures';

test.describe('UI5 Control Proxy examples', () => {
  test('shell loaded – control discovery ready @example', async ({ shell, waitForUI5, page }) => {
    await shell.expectLoaded();
    await waitForUI5();
    await expect(page.locator('.sapUshellShell, #shell-header').first()).toBeVisible();
  });

  test('List Report filter + table helpers pattern @example', async ({ shell, waitForUI5 }) => {
    await shell.expectLoaded();
    await waitForUI5();
    // Pattern:
    // await navigateToApp('Manage Purchase Orders');
    // await listReport.setFilter('Vendor', '100000');
    // await listReport.go();
    // await table.expectContainsText(/100000/);
  });
});
