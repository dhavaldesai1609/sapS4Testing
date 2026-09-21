/**
 * Fiori app catalog – tile titles and intents for Manitoba Hydro landscape.
 * Update names after Explore/Realize workshops confirm exact FLP titles.
 */
export const Apps = {
  // PTP – Procure to Pay
  managePurchaseOrders: {
    title: 'Manage Purchase Orders',
    intent: 'PurchaseOrder-manage',
  },
  managePurchaseRequisitions: {
    title: 'Manage Purchase Requisitions',
    intent: 'PurchaseRequisition-manage',
  },
  manageSupplierInvoices: {
    title: 'Manage Supplier Invoices',
    intent: 'SupplierInvoice-manage',
  },

  // RTR – Record to Report
  postGeneralJournalEntries: {
    title: 'Post General Journal Entries',
    intent: 'AccountingDocument-create',
  },
  manageJournalEntries: {
    title: 'Manage Journal Entries',
    intent: 'AccountingDocument-manage',
  },
  displayG_LAccountLineItems: {
    title: 'Display Line Items in General Ledger',
    intent: 'GLAccount-displayLineItems',
  },

  // OTC – Order to Cash
  manageSalesOrders: {
    title: 'Manage Sales Orders',
    intent: 'SalesOrder-manage',
  },
  createSalesOrders: {
    title: 'Create Sales Orders',
    intent: 'SalesOrder-create',
  },
  manageBillingDocuments: {
    title: 'Manage Billing Documents',
    intent: 'BillingDocument-manage',
  },

  // HTR – Hire to Retire (often SuccessFactors + S/4)
  manageWorkforce: {
    title: 'Manage Workforce',
    intent: 'WorkforcePerson-manage',
  },
  employeeCentral: {
    title: 'Employee Central',
    intent: 'Employee-display',
  },

  // ATR – Acquire to Retire (Asset Accounting)
  manageFixedAssets: {
    title: 'Manage Fixed Assets',
    intent: 'FixedAsset-manage',
  },
  assetExplorer: {
    title: 'Asset Explorer',
    intent: 'FixedAsset-display',
  },
} as const;

export type AppKey = keyof typeof Apps;
