export const vendors = {
  standard: '100000',
  oneTime: '999999',
};

export const materials = {
  stock: 'MAT-001',
  service: 'SRV-001',
};

export const orgData = {
  companyCode: '1000',
  purchOrg: '1000',
  plant: '1000',
  salesOrg: '1000',
  costCenter: '1000',
};

export const users = {
  buyer: process.env.SAP_USERNAME || 'BUYER01',
  apClerk: 'APCLERK01',
  glAccountant: 'GLACCT01',
};
