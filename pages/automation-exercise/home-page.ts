import { type Locator, type Page } from '@playwright/test';

export class AutomationExerciseHomePage {
  readonly logo: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;

  constructor(private readonly page: Page) {
    this.logo = page.getByRole('img', {
      name: 'Website for automation practice',
    });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.cartLink = page.getByRole('link', { name: 'Cart' });
    this.signupLoginLink = page.getByRole('link', {
      name: 'Signup / Login',
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async openProducts(): Promise<void> {
    await this.productsLink.click();
  }
}
