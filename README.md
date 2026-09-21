# sapS4Testing

**Enterprise Playwright framework for SAP S/4HANA Fiori regression**  
Modules: **RTR · OTC · PTP · HTR · ATR** — Manitoba Hydro S/4 implementation.

## Highlights (v2 – deep UI5 layer)

| Capability | Description |
|------------|-------------|
| **UI5 Control Proxies** | Discover controls via `sap.ui` runtime registry (not brittle DOM IDs). `setValue` + `fireChange`, `firePress`, typed queries. |
| **Stability waits** | `waitForUI5Stable` – core init, busy indicators, optional network quiet. |
| **Fiori Elements** | `ListReport`, `ObjectPage`, `TableHelper`, `ValueHelpHelper`, `DialogHelper`. |
| **Shell / FLP** | Search, intent navigation, home, user menu. |
| **Fixtures** | `test` from `sapFixtures` injects `control`, `listReport`, `objectPage`, `table`, `valueHelp`, `shell`, `navigateToApp`, … |
| **OData helpers** | Capture / wait for `/sap/opu/odata` traffic. |
| **Retry & soft asserts** | `withRetry`, `SoftAssert` for flaky SAP timing. |
| **Structured logging** | JSON step logger (`LOG_LEVEL=debug\|info`). |
| **Multi-landscape config** | `loadEnv()` + `SAP_LANDSCAPE`. |
| **CI** | GitHub Actions smoke pipeline with secrets + HTML report artifacts. |

## Quick start

```bash
git clone https://github.com/dhavaldesai1609/sapS4Testing.git
cd sapS4Testing
cp .env.example .env
npm install
npx playwright install chromium
npm run test:smoke
```

## Usage – control proxies

```typescript
import { test, expect } from '../src/fixtures/sapFixtures';

test('create via UI5 proxy', async ({ control, fill, press, waitForUI5, navigateToApp }) => {
  await navigateToApp('Manage Purchase Orders');
  await waitForUI5();
  await fill({ controlType: 'sap.m.Input', properties: { placeholder: /Vendor/i } }, '100000');
  const createBtn = await control({
    controlType: 'sap.m.Button',
    properties: { text: /Create|Save/i },
  });
  await createBtn.press();
});
```

## Usage – Fiori Elements

```typescript
test('list report flow', async ({ navigateToApp, listReport, table, objectPage }) => {
  await navigateToApp('Manage Purchase Orders');
  await listReport.setFilter('Vendor', '100000');
  await listReport.go();
  await table.expectContainsText(/100000/);
  await table.clickRow(0);
  await objectPage.edit();
  await objectPage.fillField('Quantity', '5');
  await objectPage.save();
  await objectPage.expectSuccess(/saved|success/i);
});
```

## Project layout

```
src/
  ui5/           ControlProxy, registry discovery, waits, types
  fiori/         ListReport, ObjectPage, Dialog, Table, ValueHelp, Shell
  fixtures/      sapFixtures (test + expect)
  pages/         BasePage, FioriLaunchpad, module POs
  utils/         navigation, logger, retry, odata
  config/        env / landscape
  data/          test data factories
tests/
  auth.setup.ts
  common/  rtr/  otc/  ptp/  htr/  atr/  examples/
```

## License

MIT
