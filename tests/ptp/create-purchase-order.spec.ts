import { test, expect } from '@playwright/test';
import { FioriLaunchpad } from '../../src/pages/FioriLaunchpad';
import { PurchaseOrderPage } from '../../src/pages/ptp/PurchaseOrder';

/**
 * @smoke @ptp
 * Sample end-to-end: Create a Purchase Order via Fiori.
 * Replace app name and master data with Manitoba Hydro values.
 */
test.describe('PTP – Procure to Pay', () => {
  test('Create Purchase Order @smoke', async ({ page }) => {
    const flp = new FioriLaunchpad(page);
    const po = new PurchaseOrderPage(page);

    await flp.openApp('Manage Purchase Orders');

    await po.createHeader('100000', '1000', '001');
    await po.addItem('MAT-001', '10', '1000');
    await po.save();

    const doc = await po.getDocumentNumber();
    expect(doc).toBeTruthy();
    console.log(`Created PO: ${doc}`);
  });
});
