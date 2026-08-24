import { test, expect } from '@playwright/test';

test('diagnostic demonstration: captures evidence for a deterministic failure', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: 'This heading intentionally does not exist',
    }),
  ).toBeVisible();
});
