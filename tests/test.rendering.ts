import { Browser, Page, TestInfo } from '@playwright/test';
import { test } from './test';

export type RenderingProperties = {
    startWidth: number;
    minWidth: number;
    widthStep: number;
    height: number;
    beforeInitHook?: (
        page: Page,
        browser: Browser,
        testInfo: TestInfo,
        properties: RenderingProperties,
        currentProcessedSize: Size
    ) => Promise<void>;
    afterInitHook?: (
        page: Page,
        browser: Browser,
        testInfo: TestInfo,
        properties: RenderingProperties,
        currentProcessedSize: Size
    ) => Promise<void>;
    afterTestHook?: (
        page: Page,
        browser: Browser,
        testInfo: TestInfo,
        properties: RenderingProperties,
        currentProcessedSize: Size
    ) => Promise<void>;
};

export type Size = {
    width: number;
    height: number;
};

export async function renderingTest(
    urlProvider: (testInfo: TestInfo) => string,
    testName: string,
    screenshotFolderSeparator: string,
    properties: RenderingProperties
): Promise<void> {
    test(testName, async ({ page, browser }, testInfo) => {
        const browserName = browser.browserType().name();
        const browserVersion = browser.version();

        let currentProcessedSize = {
            width: properties.startWidth,
            height: properties.height,
        };

        if (properties.beforeInitHook) {
            await properties.beforeInitHook(page, browser, testInfo, properties, currentProcessedSize);
        }

        await page.goto(urlProvider(testInfo));

        if (properties.afterInitHook) {
            await properties.afterInitHook(page, browser, testInfo, properties, currentProcessedSize);
        }

        while (currentProcessedSize.width >= properties.minWidth) {
            await page.evaluate(async () => await new Promise((resolve) => setTimeout(resolve, 1000)));
            await page.addStyleTag({ content: 'html,body{height:100%;overflow:hidden;margin:0;padding:0;}' });
            await page.setViewportSize({ width: currentProcessedSize.width, height: properties.height });

            const screenshotPath = `tests/screenshots/${screenshotFolderSeparator}/rendering/${browserName}/${browserName}-${browserVersion}-w${currentProcessedSize.width}.png`;
            await page.screenshot({ path: screenshotPath, animations: 'disabled', scale: 'css' });

            currentProcessedSize.width -= properties.widthStep;
        }

        if (properties.afterTestHook) {
            await properties.afterTestHook(page, browser, testInfo, properties, currentProcessedSize);
        }
    });
}
