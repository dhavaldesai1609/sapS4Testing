import { test, expect } from '../../src/fixtures/sapFixtures';
import { Apps } from '../../src/config/apps';

/**
 * @smoke @atr
 * Starter: Acquire to Retire – Manage Fixed Assets.
 */
test.describe('ATR – Acquire to Retire', () => {
  test('Navigate to Manage Fixed Assets @smoke', async ({
    shell,
    navigateToApp,
    waitForUI5,
    page,
  }) => {
    await shell.expectLoaded();
    await navigateToApp(Apps.manageFixedAssets.title);
    await waitForUI5({ waitForNetwork: true });
    await expect(
      page.locator('.sapUshellAppTitle, [class*="ObjectPage"], [class*="ListReport"], h1, h2').first()
    ).toBeVisible({ timeout: 45_000 });
  });
});
