import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'mocked',
      testIgnore: /\.live\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'live',
      testMatch: /\.live\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
