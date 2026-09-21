import { test, expect } from '../../src/fixtures/sapFixtures';
import { Apps } from '../../src/config/apps';

/**
 * @smoke @otc
 * Starter: open Manage Sales Orders (Order to Cash).
 * Expand with create / change / display flows once tile titles are confirmed.
 */
test.describe('OTC – Order to Cash', () => {
  test('Navigate to Manage Sales Orders @smoke', async ({
    shell,
    navigateToApp,
    waitForUI5,
    page,
  }) => {
    await shell.expectLoaded();
    await navigateToApp(Apps.manageSalesOrders.title);
    await waitForUI5({ waitForNetwork: true });
    await expect(
      page.locator('.sapUshellAppTitle, [class*="ObjectPage"], [class*="ListReport"], h1, h2').first()
    ).toBeVisible({ timeout: 45_000 });
  });
});
