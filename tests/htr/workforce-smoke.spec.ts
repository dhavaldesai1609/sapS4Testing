import { test, expect } from '../../src/fixtures/sapFixtures';
import { Apps } from '../../src/config/apps';

/**
 * @smoke @htr
 * Starter: Hire to Retire entry point.
 * Hydro may use SuccessFactors + S/4; adjust title/intent after landscape design.
 */
test.describe('HTR – Hire to Retire', () => {
  test('Navigate to workforce / HR app @smoke', async ({
    shell,
    navigateToApp,
    waitForUI5,
    page,
  }) => {
    await shell.expectLoaded();
    // Prefer confirmed FLP title from apps catalog
    await navigateToApp(Apps.manageWorkforce.title);
    await waitForUI5({ waitForNetwork: true });
    await expect(
      page.locator('.sapUshellAppTitle, [class*="ObjectPage"], [class*="ListReport"], h1, h2').first()
    ).toBeVisible({ timeout: 45_000 });
  });
});
