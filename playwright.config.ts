// playwright.config.ts
import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
    forbidOnly: !!process.env.CI,
    workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 2,
    retries: 2,
    use: {
        trace: 'on-first-retry',
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
    timeout: 90000,
    metadata: {
        CACHE_WARMER_RETRY_DELAY_MS: 1500,
        CACHE_WARMER_DELAY_MS: 1000,
        DOCUMENTS_PATHS: {
            HTML_README_PATH: 'file:///' + __dirname + '/README.html',
            HTML_RESPONSIVE_PATH: 'file:///' + __dirname + '/RESPONSIVE.html',
        },
        FONT_STACK: [
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Noto Sans',
            'Helvetica',
            'Arial',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
        ],
    },
};

export default config;
