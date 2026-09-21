/**
 * Typed UI5 Control Proxy – interact via control API (firePress, setValue, …)
 * with automatic UI5-native + DOM fallbacks.
 */
import { Page, Locator, expect } from '@playwright/test';
import type { ControlQuery, ControlInfo, InteractionStrategy } from './types';
import { discoverControls } from './registry';
import { waitForUI5Stable } from './waits';

export class UI5ControlProxy {
  constructor(
    private readonly page: Page,
    private readonly info: ControlInfo,
    private readonly strategy: InteractionStrategy = 'Hybrid'
  ) {}

  get id(): string {
    return this.info.id;
  }

  get controlType(): string {
    return this.info.controlType;
  }

  get domLocator(): Locator {
    if (this.info.domRefId) {
      return this.page.locator(`#${CSS.escape(this.info.domRefId)}`);
    }
    return this.page.locator(`[id="${this.info.id}"], [id*="${this.info.id}"]`).first();
  }

  async refresh(): Promise<void> {
    const list = await discoverControls(this.page, { id: this.info.id, visible: false });
    if (list[0]) Object.assign(this.info, list[0]);
  }

  async getText(): Promise<string> {
    return this.page.evaluate((id) => {
      const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
      if (!c) return '';
      if (typeof c.getText === 'function') return c.getText() ?? '';
      if (typeof c.getTitle === 'function') return c.getTitle() ?? '';
      if (typeof c.getValue === 'function') return String(c.getValue() ?? '');
      const dom = c.getDomRef?.();
      return dom?.innerText ?? dom?.textContent ?? '';
    }, this.info.id);
  }

  async getValue(): Promise<string> {
    return this.page.evaluate((id) => {
      const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
      if (!c) return '';
      if (typeof c.getValue === 'function') return String(c.getValue() ?? '');
      if (typeof c.getSelectedKey === 'function') return String(c.getSelectedKey() ?? '');
      return '';
    }, this.info.id);
  }

  async isEnabled(): Promise<boolean> {
    return this.page.evaluate((id) => {
      const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
      if (!c) return false;
      return typeof c.getEnabled === 'function' ? !!c.getEnabled() : true;
    }, this.info.id);
  }

  async isVisible(): Promise<boolean> {
    return this.page.evaluate((id) => {
      const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
      if (!c) return false;
      if (typeof c.getVisible === 'function' && !c.getVisible()) return false;
      const dom = c.getDomRef?.();
      if (!dom) return false;
      const style = window.getComputedStyle(dom);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }, this.info.id);
  }

  /** Set value the UI5 way so bindings & validation fire. */
  async setValue(value: string): Promise<void> {
    await this.page.evaluate(
      ({ id, value }) => {
        const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
        if (!c) throw new Error(`Control ${id} not found`);
        if (typeof c.setValue === 'function') {
          c.setValue(value);
          if (typeof c.fireChange === 'function') c.fireChange({ value });
          else if (typeof c.fireLiveChange === 'function') c.fireLiveChange({ value });
        } else if (typeof c.setSelectedKey === 'function') {
          c.setSelectedKey(value);
          if (typeof c.fireChange === 'function') c.fireChange({ selectedKey: value });
        } else {
          const input = c.getDomRef?.()?.querySelector?.('input, textarea') as HTMLInputElement | null;
          if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      },
      { id: this.info.id, value }
    );
    await waitForUI5Stable(this.page);
  }

  async fill(value: string): Promise<void> {
    await this.setValue(value);
  }

  async press(): Promise<void> {
    const strategy = this.strategy;
    await this.page.evaluate(
      ({ id, strategy }) => {
        const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
        if (!c) throw new Error(`Control ${id} not found`);

        const tryUI5 = () => {
          if (typeof c.firePress === 'function') { c.firePress(); return true; }
          if (typeof c.fireTap === 'function') { c.fireTap(); return true; }
          if (typeof c.fireSelect === 'function') { c.fireSelect(); return true; }
          return false;
        };

        const tryDom = () => {
          const dom = c.getDomRef?.();
          if (dom) { dom.click(); return true; }
          return false;
        };

        if (strategy === 'UI5Native') {
          if (!tryUI5()) tryDom();
        } else if (strategy === 'DomFirst') {
          if (!tryDom()) tryUI5();
        } else {
          if (!tryUI5()) tryDom();
        }
      },
      { id: this.info.id, strategy }
    );
    await waitForUI5Stable(this.page);
  }

  async click(): Promise<void> {
    await this.press();
  }

  async selectKey(key: string): Promise<void> {
    await this.page.evaluate(
      ({ id, key }) => {
        const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
        if (!c) throw new Error(`Control ${id} not found`);
        if (typeof c.setSelectedKey === 'function') {
          c.setSelectedKey(key);
          if (typeof c.fireChange === 'function') c.fireChange({ selectedKey: key });
        } else if (typeof c.setSelectedItem === 'function') {
          const items = typeof c.getItems === 'function' ? c.getItems() : [];
          const match = items.find((it: any) => it.getKey?.() === key || it.getText?.() === key);
          if (match) c.setSelectedItem(match);
        }
      },
      { id: this.info.id, key }
    );
    await waitForUI5Stable(this.page);
  }

  async focus(): Promise<void> {
    await this.page.evaluate((id) => {
      const c = (window as any).sap?.ui?.getCore?.()?.byId(id);
      c?.focus?.();
    }, this.info.id);
  }

  async expectVisible(): Promise<void> {
    await expect.poll(async () => this.isVisible()).toBeTruthy();
  }

  async expectEnabled(): Promise<void> {
    await expect.poll(async () => this.isEnabled()).toBeTruthy();
  }

  async expectText(expected: string | RegExp): Promise<void> {
    await expect.poll(async () => this.getText()).toMatch(expected);
  }

  async expectValue(expected: string | RegExp): Promise<void> {
    await expect.poll(async () => this.getValue()).toMatch(expected);
  }
}

export async function control(
  page: Page,
  query: ControlQuery,
  strategy: InteractionStrategy = 'Hybrid'
): Promise<UI5ControlProxy> {
  await waitForUI5Stable(page);
  const list = await discoverControls(page, query);
  if (!list.length) {
    throw new Error(
      `UI5 control not found: ${JSON.stringify(query)}. Ensure UI5 is loaded and the control is rendered.`
    );
  }
  const idx = query.index ?? 0;
  const info = list[idx] ?? list[0];
  return new UI5ControlProxy(page, info, strategy);
}

export async function controls(
  page: Page,
  query: ControlQuery,
  strategy: InteractionStrategy = 'Hybrid'
): Promise<UI5ControlProxy[]> {
  await waitForUI5Stable(page);
  const list = await discoverControls(page, { ...query, index: undefined });
  return list.map((info) => new UI5ControlProxy(page, info, strategy));
}
