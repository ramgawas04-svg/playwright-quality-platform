import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly mainHeading: Locator;
  readonly docsLink: Locator;

  private readonly apiLink: Locator;
  private readonly getStartedLink: Locator;
  private readonly mcpLink: Locator;

  constructor(private readonly page: Page) {
    this.mainHeading = page.getByRole('heading', {
      name: 'Playwright enables reliable web automation for testing, scripting, and AI agents.',
    });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.apiLink = page.getByRole('link', { name: 'API' });
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.mcpLink = page.getByRole('link', { name: 'MCP', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async openDocs(): Promise<void> {
    await this.docsLink.click();
  }

  async openApi(): Promise<void> {
    await this.apiLink.click();
  }

  async openGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  async openMcp(): Promise<void> {
    await this.mcpLink.click();
  }
}
