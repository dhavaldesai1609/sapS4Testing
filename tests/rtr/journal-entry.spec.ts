import { test, expect } from '../../src/fixtures/sapFixtures';
import { Apps } from '../../src/config/apps';

/**
 * @smoke @rtr
 */
test.describe('RTR – Record to Report', () => {
  test('Navigate to Journal Entry app @smoke', async ({
    shell,
    navigateToApp,
    waitForUI5,
    page,
  }) => {
    await shell.expectLoaded();
    await navigateToApp(Apps.postGeneralJournalEntries.title);
    await waitForUI5({ waitForNetwork: true });
    await expect(
      page.locator('.sapUshellAppTitle, [class*="ObjectPage"], h1, h2').first()
    ).toBeVisible({ timeout: 30_000 });
  });
});
