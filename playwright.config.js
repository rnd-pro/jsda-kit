import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  testMatch: '**/*.test.js',
  timeout: 30_000,
  workers: 1,
});
