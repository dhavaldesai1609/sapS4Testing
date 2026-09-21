# sapS4Testing

**Enterprise Playwright framework for SAP S/4HANA Fiori regression**  
Modules: **RTR · OTC · PTP · HTR · ATR** — Manitoba Hydro S/4 implementation.

## Highlights (v2.1)

| Capability | Description |
|------------|-------------|
| **UI5 Control Proxies** | Discover controls via `sap.ui` runtime registry (not brittle DOM IDs). `setValue` + `fireChange`, `firePress`, Hybrid strategy. |
| **Stability waits** | `waitForUI5Stable` – core init, busy indicators, optional network quiet. |
| **Fiori Elements** | `ListReport`, `ObjectPage`, `TableHelper`, `ValueHelpHelper`, `DialogHelper`. |
| **Shell / FLP** | Search, intent navigation, home, user menu. |
| **App catalog** | `src/config/apps.ts` – central tile titles & intents per module. |
| **Fixtures** | `control`, `listReport`, `objectPage`, `table`, `valueHelp`, `shell`, `navigateToApp`, … |
| **OData helpers** | Capture / wait for `/sap/opu/odata` traffic. |
| **Retry & soft asserts** | `withRetry`, `SoftAssert` for flaky SAP timing. |
| **Structured logging** | JSON step logger (`LOG_LEVEL=debug\|info`). |
| **Multi-landscape config** | `loadEnv()` + `SAP_LANDSCAPE`. |
| **CI** | GitHub Actions – smoke by default; workflow_dispatch suite selector (ptp/rtr/otc/htr/atr/all). |

## Quick start

```bash
git clone https://github.com/dhavaldesai1609/sapS4Testing.git
cd sapS4Testing
cp .env.example .env          # set SAP_BASE_URL, SAP_USERNAME, SAP_PASSWORD
npm install
npx playwright install chromium
npm run test:smoke
```

## Module smoke coverage

| Tag | Folder | Starter scenario |
|-----|--------|------------------|
| `@rtr` | `tests/rtr` | Post General Journal Entries |
| `@otc` | `tests/otc` | Manage Sales Orders |
| `@ptp` | `tests/ptp` | Create PO + List Report filter |
| `@htr` | `tests/htr` | Manage Workforce |
| `@atr` | `tests/atr` | Manage Fixed Assets |

Update tile names in `src/config/apps.ts` after FLP design is confirmed.

## Usage – control proxies

```typescript
import { test, expect } from '../src/fixtures/sapFixtures';
import { Apps } from '../src/config/apps';

test('create via UI5 proxy', async ({ control, fill, navigateToApp, waitForUI5 }) => {
  await navigateToApp(Apps.managePurchaseOrders.title);
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
  ui5/           ControlProxy, registry, waits, types
  fiori/         ListReport, ObjectPage, Dialog, Table, ValueHelp, Shell
  fixtures/      sapFixtures
  pages/         BasePage, FioriLaunchpad, module POs
  utils/         navigation, logger, retry, odata
  config/        env, apps (tile catalog)
  data/          test data factories
tests/
  auth.setup.ts
  common/  rtr/  otc/  ptp/  htr/  atr/  examples/
```

## CI secrets

- `SAP_BASE_URL`
- `SAP_USERNAME`
- `SAP_PASSWORD`
- `SAP_LANDSCAPE` (optional)

Manual run: **Actions → SAP S4 Regression → Run workflow** → choose suite.

## License

MIT
