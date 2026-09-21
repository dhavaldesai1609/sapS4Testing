import { logger } from './logger';

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  backoff?: number;
  onRetry?: (error: unknown, attempt: number) => void;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 3;
  const delayMs = options.delayMs ?? 1000;
  const backoff = options.backoff ?? 1.5;
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt > retries) break;
      const wait = Math.round(delayMs * Math.pow(backoff, attempt - 1));
      logger.warn(`Retry ${attempt}/${retries} after error`, { error: String(err), waitMs: wait });
      options.onRetry?.(err, attempt);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastError;
}

export class SoftAssert {
  private failures: string[] = [];

  async check(name: string, fn: () => Promise<void>): Promise<void> {
    try {
      await fn();
    } catch (err) {
      this.failures.push(`${name}: ${err}`);
      logger.warn('Soft assertion failed', { name, error: String(err) });
    }
  }

  assertNone(): void {
    if (this.failures.length) {
      throw new Error(`Soft assertions failed:\n${this.failures.join('\n')}`);
    }
  }

  getFailures(): string[] {
    return [...this.failures];
  }
}
