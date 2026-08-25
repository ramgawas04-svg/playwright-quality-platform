import { type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  readonly allProductsHeading: Locator;

  constructor(page: Page) {
    this.allProductsHeading = page.getByRole('heading', {
      name: 'All Products',
    });
  }
}
