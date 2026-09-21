import { test, expect } from '../../src/fixtures/sapFixtures';
import { PurchaseOrderPage } from '../../src/pages/ptp/PurchaseOrder';
import { logger } from '../../src/utils/logger';

test.describe('PTP – Procure to Pay', () => {
  test('Create Purchase Order @smoke', async ({ page, shell, navigateToApp }) => {
    await shell.expectLoaded();
    await navigateToApp('Manage Purchase Orders');

    const po = new PurchaseOrderPage(page);
    await po.createHeader('100000', '1000', '001');
    await po.addItem('MAT-001', '10', '1000');
    await po.save();

    const doc = await po.getDocumentNumber();
    logger.info('PO created', { document: doc });
    expect(doc).toBeTruthy();
  });
});
