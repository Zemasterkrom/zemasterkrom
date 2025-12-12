import { BrowserContext, Page } from '@playwright/test';
import path from 'path';

declare global {
    interface Window {
        FontStackDetector: any;
    }
}

export default class PlaywrightFontStackDetector {
    private context: BrowserContext;

    constructor(context: BrowserContext) {
        this.context = context;
    }

    async detect(expectedFontStack: string[]): Promise<string[]> {
        // create an isolated page
        const page = await this.context.newPage();
        try {
            await page.goto('about:blank');
            await page.waitForLoadState('load');

            await page.addScriptTag({
                path: path.resolve(__dirname, 'detect-available-fonts.js'),
            });

            await page.addScriptTag({
                path: path.resolve(__dirname, 'detect-available-font-stack.js'),
            });

            return await page.evaluate((fontStack) => {
                return new window.FontStackDetector().detect(fontStack);
            }, expectedFontStack);
        } finally {
            await page.close();
        }
    }
}
