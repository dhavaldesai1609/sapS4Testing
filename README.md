# sapS4Testing

**Scalable Playwright automation framework for SAP S/4HANA Fiori regression testing**  
Target processes: **RTR · OTC · PTP · HTR · ATR**  
Built for the Manitoba Hydro SAP S/4HANA Core implementation.

## Why this framework

- **UI5-aware** – dedicated waits for busy indicators and core initialization
- **Module-oriented** – tests and page objects grouped by end-to-end process
- **CI-ready** – GitHub Actions (or Azure DevOps) with secrets, parallel shards, HTML + JUnit reports
- **Maintainable** – Page Object Model + fixtures + data factories
- **Zero license cost** – pure open-source Playwright + TypeScript

## Quick start

```bash
git clone https://github.com/dhavaldesai1609/sapS4Testing.git
cd sapS4Testing
cp .env.example .env          # fill SAP_BASE_URL, SAP_USERNAME, SAP_PASSWORD
npm install
npx playwright install chromium
npm run test:smoke
```

## Project structure

```
├── playwright.config.ts
├── tests/
│   ├── auth.setup.ts          # stores authenticated storageState
│   ├── common/                # FLP smoke, shared
│   ├── rtr/                   # Record to Report
│   ├── otc/                   # Order to Cash
│   ├── ptp/                   # Procure to Pay
│   ├── htr/                   # Hire to Retire
│   └── atr/                   # Acquire to Retire
├── src/
│   ├── pages/                 # Page Objects (BasePage, FioriLaunchpad, module folders)
│   ├── fixtures/              # custom Playwright fixtures (extend as needed)
│   ├── utils/                 # waitForUI5Stable, navigateToApp, helpers
│   └── data/                  # test data factories
├── .github/workflows/         # regression pipeline
└── playwright/.auth/          # storageState (git-ignored)
```

## Key helpers

- `waitForUI5Stable(page)` – waits for SAP UI5 core + no busy indicators
- `navigateToApp(page, titleOrIntent)` – FLP search or semantic object navigation
- `BasePage` – common fill / click / success-message helpers

## Adding a new scenario

1. Create or extend a Page Object under `src/pages/<module>/`
2. Add a spec under `tests/<module>/`
3. Tag with `@smoke` if it should run in the daily pipeline
4. Prefer data from `src/data/testData.ts` or environment-specific JSON

## CI secrets required

- `SAP_BASE_URL`
- `SAP_USERNAME`
- `SAP_PASSWORD`

## Roadmap suggestions

- Integrate `playwright-sap` or `playwright-praman` for deeper UI5 control proxies if desired
- API seeding of master data via OData / BAPI wrappers
- Visual regression for key Fiori screens
- Self-healing locator layer

## License

MIT
