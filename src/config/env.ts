export type Landscape = 'dev' | 'qa' | 'preprod' | 'prod';

export interface SapEnv {
  landscape: Landscape;
  baseUrl: string;
  flpPath: string;
  username: string;
  password: string;
  client?: string;
  headless: boolean;
}

export function loadEnv(): SapEnv {
  const landscape = (process.env.SAP_LANDSCAPE as Landscape) || 'qa';
  return {
    landscape,
    baseUrl: process.env.SAP_BASE_URL || 'https://your-s4-qa.example.com',
    flpPath: process.env.SAP_FLP_PATH || '/sap/bc/ui2/flp',
    username: process.env.SAP_USERNAME || '',
    password: process.env.SAP_PASSWORD || '',
    client: process.env.SAP_CLIENT,
    headless: process.env.HEADLESS !== 'false',
  };
}
