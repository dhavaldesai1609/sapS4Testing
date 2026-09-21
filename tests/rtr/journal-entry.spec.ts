import { test, expect } from '../../src/fixtures/sapFixtures';

test.describe('RTR – Record to Report', () => {
  test('Navigate to Journal Entry app @smoke', async ({ shell, navigateToApp, waitForUI5, page }) => {
    await shell.expectLoaded();
    await navigateToApp('Post General Journal Entries');
    await waitForUI5({ waitForNetwork: true });
    await expect(
      page.locator('.sapUshellAppTitle, [class*="ObjectPage"], h1, h2').first()
    ).toBeVisible({ timeout: 30_000 });
  });
});
