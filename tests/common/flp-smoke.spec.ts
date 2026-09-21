import { test, expect } from '../../src/fixtures/sapFixtures';

test.describe('Common – Fiori Launchpad', () => {
  test('Launchpad loads and shell is visible @smoke', async ({ shell, waitForUI5 }) => {
    await waitForUI5();
    await shell.expectLoaded();
  });

  test('Can return to home @smoke', async ({ shell }) => {
    await shell.expectLoaded();
    await shell.goHome();
    await shell.expectLoaded();
  });
});
