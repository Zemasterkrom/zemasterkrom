// playwright.config.ts
import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  workers: process.env.WORKERS ? parseFloat(process.env.WORKERS) : 2,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  timeout: 75000,
  metadata: {
    HTML_README_PATH: 'file:///' + __dirname + '/README.html',
    HTML_RESPONSIVE_DOCUMENT_PATH: 'file:///' + __dirname + '/RESPONSIVE.html',
    FONT_STACK: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Noto Sans",
      "Helvetica",
      "Arial",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji"
    ]
  }
};
export default config;