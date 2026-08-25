import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: './examples/playwright-dev',
  testMatch: 'playwright-dev.spec.ts',
  use: {
    ...baseConfig.use,
    baseURL: 'https://playwright.dev',
  },
});
