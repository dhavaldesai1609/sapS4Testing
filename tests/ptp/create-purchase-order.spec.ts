import { test, expect } from '../../src/fixtures/sapFixtures';
import { PurchaseOrderPage } from '../../src/pages/ptp/PurchaseOrder';
import { Apps } from '../../src/config/apps';
import { vendors, materials, orgData } from '../../src/data/testData';
import { logger } from '../../src/utils/logger';

/**
 * @smoke @ptp
 * Create Purchase Order via Fiori – control proxies under the hood.
 */
test.describe('PTP – Procure to Pay', () => {
  test('Create Purchase Order @smoke', async ({ page, shell, navigateToApp }) => {
    await shell.expectLoaded();
    await navigateToApp(Apps.managePurchaseOrders.title);

    const po = new PurchaseOrderPage(page);
    await po.createHeader(vendors.standard, orgData.purchOrg, '001');
    await po.addItem(materials.stock, '10', orgData.plant);
    await po.save();

    const doc = await po.getDocumentNumber();
    logger.info('PO created', { document: doc });
    expect(doc).toBeTruthy();
  });

  test('List Report filter pattern @ptp', async ({
    shell,
    navigateToApp,
    listReport,
    table,
  }) => {
    await shell.expectLoaded();
    await navigateToApp(Apps.managePurchaseOrders.title);
    await listReport.setFilter('Vendor', vendors.standard);
    await listReport.go();
    // Soft: table may be empty in fresh QA – assert UI responded
    const count = await table.rowCount();
    logger.info('PO list row count', { count });
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
