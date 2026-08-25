import { test as base, expect } from '@playwright/test';
import { ApiPage } from './pages/api-page';
import { DocsPage } from './pages/docs-page';
import { HomePage } from './pages/home-page';
import { McpPage } from './pages/mcp-page';

type PlaywrightDevFixtures = {
  homePage: HomePage;
  docsPage: DocsPage;
  apiPage: ApiPage;
  mcpPage: McpPage;
};

export const test = base.extend<PlaywrightDevFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  docsPage: async ({ page }, use) => {
    await use(new DocsPage(page));
  },
  apiPage: async ({ page }, use) => {
    await use(new ApiPage(page));
  },
  mcpPage: async ({ page }, use) => {
    await use(new McpPage(page));
  },
});

export { expect };
