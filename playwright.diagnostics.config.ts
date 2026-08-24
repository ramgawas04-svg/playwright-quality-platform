import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: './diagnostics',
  testMatch: 'failure-diagnostics.spec.ts',
  fullyParallel: false,
});
