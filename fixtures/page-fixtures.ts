import { test as base, expect } from '@playwright/test';
import { PostsApi } from '../api/posts-api';
import { UsersApi } from '../api/users-api';
import { resolveEnvironment } from '../config/environments';
import { ApiPage } from '../pages/api-page';
import { DocsPage } from '../pages/docs-page';
import { HomePage } from '../pages/home-page';
import { McpPage } from '../pages/mcp-page';

export type TestFixtures = {
  homePage: HomePage;
  docsPage: DocsPage;
  apiPage: ApiPage;
  mcpPage: McpPage;
  postsApi: PostsApi;
  usersApi: UsersApi;
};

export const test = base.extend<TestFixtures>({
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
  postsApi: async ({ request }, use) => {
    const environment = resolveEnvironment();

    await use(new PostsApi(request, environment.apiUrl));
  },
  usersApi: async ({ request }, use) => {
    const environment = resolveEnvironment();

    await use(new UsersApi(request, environment.apiUrl));
  },
});

export { expect };
