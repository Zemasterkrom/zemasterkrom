import { expect, Locator, Page, TestInfo } from "@playwright/test";
import { htmlMediaInfo, test, testStepDescription } from "./test";

export type Size = {
    width: number,
    height: number
};

export type ImageResponsiveTest = {
    name: string;
    imgSelector: string;
    viewportSizes: (imgLocator: Locator) => Size[];
    waiter: (previousSrc: string, page: Page, imgLocator: Locator) => Promise<void>;
    initHook?: (page: Page) => Promise<void>;
    test: (previousSrc: string, currentSrc: string, previousSize: Size, currentSize: Size, viewPortSize: Size, imgLocator: Locator) => Promise<void>;
}

export async function responsiveTests(urlProvider: (testInfo: TestInfo) => string, describeName: string, responsiveTests: ImageResponsiveTest[], initHook?: (page: Page) => Promise<void>): Promise<void> {
    test.describe(describeName, () => {
        test.beforeEach(async ({ page }, testInfo) => {
            await page.goto(urlProvider(testInfo));
            await page.setViewportSize({ width: 2048, height: page.viewportSize()?.height || 1024 });
            await page.evaluate(() => {
                document.body.style.margin = '0';
            });
            if (initHook) await initHook(page);
        });

        responsiveTests.forEach((responsiveTest) => {
            test(responsiveTest.name, async ({ page }) => {
                const getNewSrc = async (loc: Locator) => await loc.evaluate((img: HTMLImageElement) => img.currentSrc || img.src);

                const imgsLocator = page.locator(responsiveTest.imgSelector);
                const count = await imgsLocator.count();
                expect(count).toBeGreaterThan(0);

                for (let i = 0; i < count; i++) {
                    let imgLocator = imgsLocator.nth(i);
                    await expect(imgLocator).toBeVisible();

                    const viewportSizes = responsiveTest.viewportSizes(imgLocator);
                    const mediaInfo = await htmlMediaInfo(imgLocator, i);

                    await test.step(await testStepDescription(mediaInfo), async () => {
                        for (const viewportSize of viewportSizes) {
                            let previousSrc = await getNewSrc(imgLocator);
                            expect(previousSrc).toBeTruthy();

                            let previousSize = await imgLocator.evaluate((img: HTMLImageElement) => {
                                return {
                                    width: img.offsetWidth,
                                    height: img.offsetHeight
                                }
                            });

                            await page.setViewportSize(viewportSize);
                            await responsiveTest.waiter(previousSrc, page, imgLocator);

                            let currentSize = await imgLocator.evaluate((img: HTMLImageElement) => {
                                return {
                                    width: img.offsetWidth,
                                    height: img.offsetHeight
                                };
                            });

                            const currentSrc = await getNewSrc(imgLocator);
                            await responsiveTest.test(previousSrc, currentSrc, previousSize, currentSize, viewportSize, imgLocator);
                            previousSrc = currentSrc;
                        }
                    });
                }
            });
        });
    });
}


