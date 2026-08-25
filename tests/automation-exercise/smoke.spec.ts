import { test, expect } from '../../fixtures/page-fixtures';

test('loads the Automation Exercise homepage', async ({
  automationExerciseHomePage,
}) => {
  await automationExerciseHomePage.open();

  await expect(automationExerciseHomePage.logo).toBeVisible();
});

test('opens the All Products page', async ({
  page,
  automationExerciseHomePage,
  productsPage,
}) => {
  await automationExerciseHomePage.open();
  await automationExerciseHomePage.openProducts();

  await expect(page).toHaveURL(/\/products$/);
  await expect(productsPage.allProductsHeading).toBeVisible();
});

test('shows the primary homepage navigation', async ({
  automationExerciseHomePage,
}) => {
  await automationExerciseHomePage.open();

  await expect(automationExerciseHomePage.productsLink).toBeVisible();
  await expect(automationExerciseHomePage.cartLink).toBeVisible();
  await expect(automationExerciseHomePage.signupLoginLink).toBeVisible();
});
