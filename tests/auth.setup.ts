import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate to SAP Fiori Launchpad', async ({ page }) => {
  const baseUrl = process.env.SAP_BASE_URL!;
  const flpPath = process.env.SAP_FLP_PATH || '/sap/bc/ui2/flp';
  const username = process.env.SAP_USERNAME!;
  const password = process.env.SAP_PASSWORD!;

  await page.goto(`${baseUrl}${flpPath}`);

  // Classic SAP logon or IAS / Azure AD – adapt selectors to your landscape
  const userField = page.locator('#sap-user, input[name="sap-user"], input[placeholder*="User"]');
  if (await userField.isVisible({ timeout: 8000 }).catch(() => false)) {
    await userField.fill(username);
    await page.locator('#sap-password, input[name="sap-password"], input[type="password"]').fill(password);
    await page.locator('#LOGON_BUTTON, button:has-text("Log On"), button:has-text("Sign in")').click();
  } else {
    await page.getByLabel(/user|email|id/i).fill(username);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /log|sign/i }).click();
  }

  await expect(page.locator('.sapUshellShell, #shell-header, [id*="shell"]').first()).toBeVisible({ timeout: 60_000 });
  await page.context().storageState({ path: authFile });
});
