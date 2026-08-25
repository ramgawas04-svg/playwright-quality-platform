import { test as base, expect } from '@playwright/test';
import { ApiClient } from '../api/core/api-client';
import { PostsApi } from '../api/posts-api';
import { UsersApi } from '../api/users-api';
import { resolveEnvironment } from '../config/environments';
import { AutomationExerciseHomePage } from '../pages/automation-exercise/home-page';
import { ProductsPage } from '../pages/automation-exercise/products-page';

export type TestFixtures = {
  automationExerciseHomePage: AutomationExerciseHomePage;
  productsPage: ProductsPage;
  apiClient: ApiClient;
  postsApi: PostsApi;
  usersApi: UsersApi;
};

export const test = base.extend<TestFixtures>({
  automationExerciseHomePage: async ({ page }, use) => {
    await use(new AutomationExerciseHomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  apiClient: async ({ request }, use) => {
    const environment = resolveEnvironment();

    await use(new ApiClient(request, environment.apiUrl));
  },
  postsApi: async ({ apiClient }, use) => {
    await use(new PostsApi(apiClient));
  },
  usersApi: async ({ apiClient }, use) => {
    await use(new UsersApi(apiClient));
  },
});

export { expect };
