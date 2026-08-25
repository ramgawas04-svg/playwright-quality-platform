import { type Locator, type Page } from '@playwright/test';

export class McpPage {
  readonly playwrightMcpHeading: Locator;

  constructor(page: Page) {
    this.playwrightMcpHeading = page.getByRole('heading', {
      name: 'Playwright MCP',
      exact: true,
    });
  }
}
