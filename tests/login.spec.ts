import { test, expect } from '../fixtures/page-fixtures';

test('opens the Playwright documentation', async ({ page, homePage }) => {
  await homePage.open();

  await expect(page).toHaveTitle(/Playwright/);
});

test('should open docs', async ({ page, homePage }) => {
  await homePage.open();
  await homePage.openDocs();

  await expect(page).toHaveURL(/docs/);
});

test('should open API reference', async ({ page, homePage }) => {
  await homePage.open();
  await homePage.openApi();

  await expect(page).toHaveURL(/api/);
});

test('displays the main homepage heading', async ({ homePage }) => {
  await homePage.open();

  await expect(homePage.mainHeading).toBeVisible();
});

test('displays the Docs navigation link', async ({ homePage }) => {
  await homePage.open();

  await expect(homePage.docsLink).toBeVisible();
});

test(
  'opens the installation guide from Get started',
  async ({ page, homePage, docsPage }) => {
    await homePage.open();
    await homePage.openGetStarted();

    await expect(page).toHaveURL(/\/docs\/intro/);
    await expect(docsPage.installationHeading).toBeVisible();
  },
);

test('opens the Playwright API documentation', async ({ page, homePage, apiPage }) => {
  await homePage.open();
  await homePage.openApi();

  await expect(page).toHaveURL(/\/docs\/api\/class-playwright/);
  await expect(apiPage.playwrightLibraryHeading).toBeVisible();
});

test('opens the MCP documentation', async ({ page, homePage, mcpPage }) => {
  await homePage.open();
  await homePage.openMcp();

  await expect(page).toHaveURL(/\/mcp\/introduction/);
  await expect(mcpPage.playwrightMcpHeading).toBeVisible();
});
