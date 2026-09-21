/**
 * Robust UI5 stability waits for large-scale regression suites.
 */
import { Page } from '@playwright/test';

export interface WaitOptions {
  timeout?: number;
  waitForNetwork?: boolean;
  settleMs?: number;
}

export async function waitForUI5Stable(page: Page, options: WaitOptions = {}): Promise<void> {
  const timeout = options.timeout ?? 30_000;
  const settleMs = options.settleMs ?? 250;

  await page.waitForFunction(
    () => {
      const sap = (window as any).sap;
      if (!sap?.ui?.getCore) return false;
      const core = sap.ui.getCore();
      if (typeof core.isInitialized === 'function' && !core.isInitialized()) return false;

      const busySelectors = [
        '.sapUiLocalBusyIndicator',
        '.sapMBusyIndicator',
        '.sapUiBusy',
        '.sapMBusyOverlay',
        '.sapUiBlockLayer',
        '[aria-busy="true"]',
      ];
      for (const sel of busySelectors) {
        if (document.querySelector(sel)) return false;
      }

      try {
        if (core.getUIDirty && core.getUIDirty()) return false;
      } catch (_) {}

      return true;
    },
    { timeout }
  );

  if (options.waitForNetwork) {
    try {
      await page.waitForLoadState('networkidle', { timeout: Math.min(timeout, 15_000) });
    } catch {
      /* best-effort */
    }
  }

  if (settleMs > 0) {
    await page.waitForTimeout(settleMs);
  }
}

export async function waitForControl(
  page: Page,
  predicate: { id?: string; controlType?: string; text?: string },
  timeout = 30_000
): Promise<void> {
  await page.waitForFunction(
    (p) => {
      const sap = (window as any).sap;
      if (!sap?.ui?.getCore) return false;
      const core = sap.ui.getCore();
      if (p.id) {
        return !!core.byId(p.id);
      }
      try {
        const reg = (window as any).sap?.ui?.core?.Element?.registry;
        const all = reg?.all?.() || {};
        for (const k of Object.keys(all)) {
          const c = all[k];
          const meta = c.getMetadata?.();
          const type = meta?.getName?.() || '';
          if (p.controlType && type.indexOf(p.controlType) === -1) continue;
          if (p.text) {
            const t = c.getText?.() || c.getValue?.() || '';
            if (String(t).indexOf(p.text) === -1) continue;
          }
          return true;
        }
      } catch (_) {}
      return false;
    },
    predicate,
    { timeout }
  );
  await waitForUI5Stable(page, { timeout: 10_000 });
}

export async function waitForMessage(
  page: Page,
  contains?: string | RegExp,
  timeout = 15_000
): Promise<string> {
  const locator = page.locator(
    '.sapMMessageToast, .sapMMsgStrip, .sapMMessageBox, [class*="MessageToast"], [class*="sapMMsg"]'
  );
  await locator.first().waitFor({ state: 'visible', timeout });
  const text = (await locator.first().innerText()).trim();
  if (contains) {
    const re = typeof contains === 'string' ? new RegExp(contains, 'i') : contains;
    if (!re.test(text)) {
      throw new Error(`Message did not match ${contains}: got "${text}"`);
    }
  }
  return text;
}

export async function waitForBusyGone(page: Page, timeout = 30_000): Promise<void> {
  await page.waitForFunction(
    () => {
      const sels = ['.sapUiLocalBusyIndicator', '.sapMBusyIndicator', '.sapUiBusy', '.sapMBusyOverlay'];
      return sels.every((s) => !document.querySelector(s));
    },
    { timeout }
  );
}
