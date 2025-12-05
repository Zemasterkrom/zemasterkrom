import { expect, Locator, Page, TestInfo } from "@playwright/test";
import { htmlMediaInfo, test, testStepDescription } from "./test";

type ThemeTestFn<T extends boolean> =
    T extends true
    ? (page: Page, locator: Locator, screenshotPath: string) => Promise<void>
    : (page: Page, locator: Locator, screenshotPath: string | null) => Promise<void>;

interface ColorSchemeTestBase<T extends boolean> {
    name: string;
    selector: string;
    screenshot: T;
    initHook?: (page: Page) => Promise<void>;
    test: {
        dark?: ThemeTestFn<T>;
        light?: ThemeTestFn<T>;
    }
}

export type ColorSchemeTest = ColorSchemeTestBase<true> | ColorSchemeTestBase<false>;

export function isDark(rgb: number[]) {
    if (rgb.length < 3) {
        throw new Error('Color array must contains 3 numbers for the RGB color code');
    }

    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) <= 127.5;
}

export function isLight(rgb: number[]) {
    return !isDark(rgb);
}


export async function colorSchemeTests(urlProvider: (testInfo: TestInfo) => string | Promise<string>, describeName: string, screenshotFolderSeparator: string, colorSchemeTests: ColorSchemeTest[], initHook?: (page: Page) => Promise<void>): Promise<void> {
    for (const theme of ['dark', 'light'] as const) {
        test.describe(`${describeName} - ${theme} theme`, () => {
            test.use({ colorScheme: theme });

            test.beforeEach(async ({ page }, testInfo) => {
                await page.goto(await urlProvider(testInfo));
                await page.waitForLoadState('load');
                await page.evaluate(() => {
                    document.body.style.margin = '0';
                });
                await page.setViewportSize({ width: 1024, height: 6000 });

                if (initHook) await initHook(page);
            });

            colorSchemeTests.forEach((colorSchemeTest) => {
                if (colorSchemeTest.test[theme]) {
                    test(colorSchemeTest.name, async ({ page, browser }) => {
                        const browserName = browser.browserType().name();
                        const browserVersion = browser.version();
                        const globalLocator = page.locator(colorSchemeTest.selector);

                        const count = await globalLocator.count();
                        expect(count).toBeGreaterThan(0);

                        for (let index = 0; index < count; index++) {
                            const elementLocator = globalLocator.nth(index);
                            const mediaInfo = await htmlMediaInfo(elementLocator, index);

                            await test.step(await testStepDescription(mediaInfo), async () => {
                                await elementLocator.waitFor({ state: 'visible', timeout: 10000 });

                                if (colorSchemeTest.screenshot) {
                                    const screenshotPath = `tests/screenshots/${screenshotFolderSeparator}/colors/${browserName}-${browserVersion}-${colorSchemeTest.name.replace(/[^a-zA-Z0-9]/g, '-')}-${theme}-${mediaInfo?.alt?.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
                                    await elementLocator.screenshot({ path: screenshotPath, scale: 'css' });
                                    await colorSchemeTest.test[theme]!(page, globalLocator, screenshotPath);
                                } else {
                                    await colorSchemeTest.test[theme]!(page, globalLocator, null);
                                }
                            });
                        }
                    });
                }
            });
        });
    };
}