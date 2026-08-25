import { type Locator, type Page } from '@playwright/test';

export class ApiPage {
  readonly playwrightLibraryHeading: Locator;

  constructor(page: Page) {
    this.playwrightLibraryHeading = page.getByRole('heading', {
      name: 'Playwright Library',
    });
  }
}
