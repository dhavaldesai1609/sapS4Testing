import { Page, Request, Response } from '@playwright/test';
import { logger } from './logger';

export interface ODataCapture {
  url: string;
  method: string;
  status?: number;
  body?: unknown;
}

export class ODataHelper {
  private captures: ODataCapture[] = [];

  constructor(private readonly page: Page) {}

  async startCapture(urlPattern = /\/sap\/opu\/odata/): Promise<void> {
    this.page.on('request', (req: Request) => {
      if (urlPattern.test(req.url())) {
        this.captures.push({ url: req.url(), method: req.method() });
        logger.debug('OData request', { method: req.method(), url: req.url() });
      }
    });
    this.page.on('response', async (res: Response) => {
      if (urlPattern.test(res.url())) {
        const entry = this.captures.find((c) => c.url === res.url() && !c.status);
        if (entry) {
          entry.status = res.status();
          try {
            entry.body = await res.json().catch(() => undefined);
          } catch { /* ignore */ }
        }
      }
    });
  }

  getCaptures(): ODataCapture[] {
    return [...this.captures];
  }

  clear(): void {
    this.captures = [];
  }

  findByPath(pathFragment: string): ODataCapture[] {
    return this.captures.filter((c) => c.url.includes(pathFragment));
  }

  async waitForRequest(pathFragment: string, timeout = 30_000): Promise<Request> {
    return this.page.waitForRequest(
      (req) => req.url().includes(pathFragment) && /\/sap\/opu\/odata/.test(req.url()),
      { timeout }
    );
  }

  async waitForResponse(pathFragment: string, timeout = 30_000): Promise<Response> {
    return this.page.waitForResponse(
      (res) => res.url().includes(pathFragment) && /\/sap\/opu\/odata/.test(res.url()),
      { timeout }
    );
  }
}
