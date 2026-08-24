import { type Locator, type Page } from '@playwright/test';

export class DocsPage {
  readonly installationHeading: Locator;

  constructor(page: Page) {
    this.installationHeading = page.getByRole('heading', {
      name: 'Installation',
    });
  }
}
