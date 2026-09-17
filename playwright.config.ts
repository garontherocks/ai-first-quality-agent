import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/api',
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://127.0.0.1:3000' },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000/health',
    reuseExistingServer: !process.env.CI,
  },
})
