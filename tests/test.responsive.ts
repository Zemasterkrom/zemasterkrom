import { Browser, expect, Locator, Page, TestInfo } from '@playwright/test';
import { htmlMediaInfo, test, testStepDescription } from './test';

export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type ImageResponsiveTest = {
    name: string;
    imgSelector: string;
    viewportWidths: (imgLocator: Locator) => number[];
    waiter?: (previousSrc: string, page: Page, imgLocator: Locator) => Promise<void>;
    prePreviousBoundingBoxHook?: (page: Page, imgLocator: Locator) => Promise<void>;
    preCurrentBoundingBoxHook?: (page: Page, imgLocator: Locator) => Promise<void>;
    initHook?: (page: Page, imgLocator: Locator) => Promise<void>;
    test: (
        previousSrc: string,
        currentSrc: string,
        previousBoundingBox: BoundingBox,
        currentBoundingBox: BoundingBox,
        viewportWidth: number,
        imgLocator: Locator,
        page: Page,
        browser: Browser,
        testInfo: TestInfo
    ) => Promise<void>;
};

export async function responsiveTests(
    urlProvider: (testInfo: TestInfo) => string,
    describeName: string,
    responsiveTests: ImageResponsiveTest[],
    initHook?: (page: Page) => Promise<void>
): Promise<void> {
    test.describe(describeName, () => {
        test.beforeEach(async ({ page }, testInfo) => {
            await page.goto(urlProvider(testInfo));
            await page.addStyleTag({ content: 'html,body{height:100%;overflow:hidden;margin:0;padding:0;}' });
            await page.evaluate(() => {
                document.body.style.margin = '0';
            });
            if (initHook) await initHook(page);
        });

        responsiveTests.forEach((responsiveTest) => {
            test(responsiveTest.name, async ({ page, browser }, testInfo) => {
                const getNewSrc = async (loc: Locator) => await loc.evaluate((img: HTMLImageElement) => img.currentSrc || img.src);

                const imgsLocator = page.locator(responsiveTest.imgSelector);
                const count = await imgsLocator.count();
                expect(count).toBeGreaterThan(0);

                for (let i = 0; i < count; i++) {
                    let imgLocator = imgsLocator.nth(i);
                    await expect(imgLocator).toBeVisible();
                    await page.setViewportSize({ width: 2048, height: page.viewportSize()!.height });
                    let previousBoundingBox = (await imgLocator.boundingBox())!;
                    let currentBoundingBox = (await imgLocator.boundingBox())!;

                    const viewportWidths = responsiveTest.viewportWidths(imgLocator);
                    const mediaInfo = await htmlMediaInfo(imgLocator, i);

                    await test.step(await testStepDescription(mediaInfo), async () => {
                        for (const viewportWidth of viewportWidths) {
                            let previousSrc = await getNewSrc(imgLocator);
                            expect(previousSrc).toBeTruthy();

                            if (responsiveTest.prePreviousBoundingBoxHook) {
                                await responsiveTest.prePreviousBoundingBoxHook(page, imgLocator);
                            }

                            previousBoundingBox = (await imgLocator.boundingBox())!;

                            await page.setViewportSize({ width: viewportWidth, height: page.viewportSize()!.height });

                            if (!responsiveTest.waiter) {
                                const count = await imgLocator.count();

                                for (let i = 0; i < count; i++) {
                                    await expect(imgLocator.nth(i)).toBeVisible();
                                }
                            } else {
                                await responsiveTest.waiter(previousSrc, page, imgLocator);
                            }

                            if (responsiveTest.preCurrentBoundingBoxHook) {
                                await responsiveTest.preCurrentBoundingBoxHook(page, imgLocator);
                            }

                            currentBoundingBox = (await imgLocator.boundingBox())!;

                            const currentSrc = await getNewSrc(imgLocator);
                            await responsiveTest.test(
                                previousSrc,
                                currentSrc,
                                previousBoundingBox,
                                currentBoundingBox,
                                viewportWidth,
                                imgLocator,
                                page,
                                browser,
                                testInfo
                            );
                            previousSrc = currentSrc;
                        }
                    });
                }
            });
        });
    });
}
