import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { loadEnv } from '../src/config/env';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate to SAP Fiori Launchpad', async ({ page }) => {
  const env = loadEnv();
  await page.goto(`${env.baseUrl}${env.flpPath}`);

  const userField = page.locator('#sap-user, input[name="sap-user"], input[placeholder*="User"]');
  if (await userField.isVisible({ timeout: 8000 }).catch(() => false)) {
    await userField.fill(env.username);
    await page.locator('#sap-password, input[name="sap-password"], input[type="password"]').fill(env.password);
    await page.locator('#LOGON_BUTTON, button:has-text("Log On"), button:has-text("Sign in")').click();
  } else {
    await page.getByLabel(/user|email|id/i).fill(env.username);
    await page.getByLabel(/password/i).fill(env.password);
    await page.getByRole('button', { name: /log|sign/i }).click();
  }

  await expect(page.locator('.sapUshellShell, #shell-header, [id*="shell"]').first()).toBeVisible({
    timeout: 60_000,
  });
  await page.context().storageState({ path: authFile });
});
