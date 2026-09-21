/**
 * FLP / intent navigation utilities.
 */
import { Page } from '@playwright/test';
import { waitForUI5Stable } from '../ui5/waits';

export async function navigateToApp(page: Page, appTitleOrIntent: string): Promise<void> {
  await waitForUI5Stable(page);

  const search = page.locator(
    '#shell-header-search-field, input[placeholder*="Search"], .sapUshellSearchField input'
  );
  if (await search.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
    await search.first().click();
    await search.first().fill(appTitleOrIntent);
    await page.keyboard.press('Enter');
    await waitForUI5Stable(page);
    const tile = page
      .locator(`.sapUshellTile:has-text("${appTitleOrIntent}"), [title*="${appTitleOrIntent}"]`)
      .first();
    if (await tile.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await tile.click();
      await waitForUI5Stable(page, { waitForNetwork: true });
      return;
    }
  }

  const isIntent = appTitleOrIntent.includes('-') && !appTitleOrIntent.includes(' ');
  if (isIntent) {
    await page.evaluate((intent) => {
      const parts = intent.split('-');
      const semanticObject = parts[0];
      const action = parts.slice(1).join('-') || 'display';
      const ushell = (window as any).sap?.ushell;
      if (ushell?.Container) {
        return ushell.Container.getServiceAsync('CrossApplicationNavigation').then((nav: any) =>
          nav.toExternal({ target: { semanticObject, action } })
        );
      }
    }, appTitleOrIntent);
    await waitForUI5Stable(page, { waitForNetwork: true });
    return;
  }

  await page.evaluate((name) => {
    const ushell = (window as any).sap?.ushell;
    if (ushell?.Container) {
      ushell.Container.getServiceAsync('CrossApplicationNavigation').then((nav: any) => {
        nav.toExternal({ target: { shellHash: name } });
      });
    }
  }, appTitleOrIntent);
  await waitForUI5Stable(page, { waitForNetwork: true });
}

export async function navigateByIntent(
  page: Page,
  semanticObject: string,
  action: string,
  params?: Record<string, string>
): Promise<void> {
  await waitForUI5Stable(page);
  await page.evaluate(
    ({ semanticObject, action, params }) => {
      const ushell = (window as any).sap?.ushell;
      if (!ushell?.Container) throw new Error('ushell Container not available');
      return ushell.Container.getServiceAsync('CrossApplicationNavigation').then((nav: any) =>
        nav.toExternal({ target: { semanticObject, action }, params: params || {} })
      );
    },
    { semanticObject, action, params }
  );
  await waitForUI5Stable(page, { waitForNetwork: true });
}
