import { Page, Locator } from '@playwright/test';

/**
 * Wait until SAP UI5 framework reports stable (no busy indicators, pending requests).
 * Critical for reliable Fiori automation.
 */
export async function waitForUI5Stable(page: Page, timeout = 30_000): Promise<void> {
  await page.waitForFunction(
    () => {
      const sap = (window as any).sap;
      if (!sap?.ui?.getCore) return false;
      const core = sap.ui.getCore();
      if (!core.isInitialized?.()) return false;
      const busy = document.querySelectorAll('.sapUiLocalBusyIndicator, .sapMBusyIndicator, .sapUiBusy');
      if (busy.length > 0) return false;
      return true;
    },
    { timeout }
  );
  await page.waitForTimeout(300);
}

/**
 * Navigate to a Fiori app via intent (semantic object + action) or search.
 */
export async function navigateToApp(page: Page, appTitleOrIntent: string): Promise<void> {
  await waitForUI5Stable(page);

  const search = page.locator('#shell-header-search-field, input[placeholder*="Search"], .sapUshellSearchField input');
  if (await search.isVisible({ timeout: 5000 }).catch(() => false)) {
    await search.click();
    await search.fill(appTitleOrIntent);
    await page.keyboard.press('Enter');
    await waitForUI5Stable(page);
    const tile = page.locator(`.sapUshellTile:has-text("${appTitleOrIntent}"), [title*="${appTitleOrIntent}"]`).first();
    if (await tile.isVisible({ timeout: 5000 }).catch(() => false)) {
      await tile.click();
    }
  } else {
    await page.evaluate((intent) => {
      const ushell = (window as any).sap?.ushell;
      if (ushell?.Container) {
        ushell.Container.getServiceAsync('CrossApplicationNavigation').then((nav: any) => {
          nav.toExternal({ target: { semanticObject: intent.split('-')[0], action: intent.split('-')[1] || 'display' } });
        });
      }
    }, appTitleOrIntent);
  }
  await waitForUI5Stable(page);
}

/**
 * Helper to locate UI5 control by control type + properties (text, id, etc.)
 */
export function ui5Control(page: Page, options: { controlType?: string; text?: string; id?: string }): Locator {
  if (options.text) {
    return page.locator(`[class*="${options.controlType || ''}"]:has-text("${options.text}"), button:has-text("${options.text}"), [title="${options.text}"]`).first();
  }
  if (options.id) {
    return page.locator(`#${options.id}, [id*="${options.id}"]`).first();
  }
  return page.locator(`[class*="${options.controlType}"]`).first();
}
