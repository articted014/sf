# Project Setup & Test Guide

## Environment Variables

This project uses a `.env` file to manage secrets and environment-specific configuration. You can find an example in `.env.example`.

**To set up your environment:**
1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required values for each variable in `.env` (such as `WEB_URL`, `API_URL`, `TOKEN`, `ADDRESS`, `DEV_NETWORK`
`MAIN_NETWORK`, etc.). The data values are provided in the docs Automation test assignment.

**Note:** Never commit your real `.env` file to version control.

---

## Running Tests

### Install Dependencies
First, install all required packages:
```bash
npm install
```

### WebdriverIO (E2E) Test Scripts
- `npm run wdio` — Run all E2E tests with the default browser (Chrome).
- `npm run wdio:chrome` — Run E2E tests in Chrome.
- `npm run wdio:firefox` — Run E2E tests in Firefox.
- `npm run wdio:safari` — Run E2E tests in Safari.
- `npm run wdio:edge` — Run E2E tests in Microsoft Edge.
- `npm run allure` — Run E2E tests, generate Allure HTML report, and open it in your browser.
- `npm run allure:report` — Generate the Allure HTML report from the latest test run.
- `npm run allure:open` — Open the Allure HTML report in your browser.

### Playwright (API) Test Scripts
- `npm run playwright:test` — Run all Playwright API tests.
- `npm run playwright:test:devnet` — Run only the devnet token validation test.
- `npm run playwright:test:sol` — Run only the sol token validation test.
- `npm run playwright:test:switch` — Run only the network switching test.
- `npm run playwright:test:break` — Run only the break API test.
- `npm run playwright:allure` — Run Playwright tests, generate Allure HTML report, and open it in your browser (if configured).
- `npm run playwright:allure:report` — Generate the Allure HTML report from Playwright results.
- `npm run playwright:allure:open` — Open the Playwright Allure HTML report in your browser.

---

## Notes
- Make sure your `.env` file is present and filled out before running any tests.
- Allure reports are generated in the `allure-report` folder and require `allure-commandline` to be installed (already included as a dev dependency).
- Screenshots for failed E2E tests are saved in the `screenshots` folder.
- For Playwright Allure integration, ensure you have a `playwright.config.ts` with the Allure reporter enabled.
- `logLevel` is set to `silent` due to `logger` is implemented, but if you need more detailed version of the logs, set it to `info` in the `wdio.conf.ts`

---

## Troubleshooting
- If you see errors about missing environment variables, double-check your `.env` file and variable names.
- If Allure commands are not recognized, try running `npx allure` instead of `allure`.
- For browser-specific issues, ensure the browser is installed on your system.

---

For more details, see the comments.
