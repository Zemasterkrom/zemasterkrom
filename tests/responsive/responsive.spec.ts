import { expect, Locator, Page } from '@playwright/test';
import { ImageResponsiveTest, responsiveTests, Size } from '../test.responsive';

const TESTS: ImageResponsiveTest[] = [
    {
        name: 'Full-width and full-height images (100%) change width depending on the size of the window.',
        imgSelector: `[alt~="full-width"],[alt~="full-height"]`,
        viewportSizes: (_ignored: Locator) => {
            return [
                {
                    width: 1024,
                    height: 4096
                },
                {
                    width: 256,
                    height: 4096
                }
            ]
        },
        waiter: async (_ignored: string, _ignoredTwo: Page, imgLocator: Locator) => await expect(imgLocator).toBeVisible(),
        test: async (_ignored: string, _ignoredTwo: string, _ignoredThree: Size, currentSize: Size, viewPortSize: Size, imgLocator: Locator) => {
            await expect(imgLocator).toBeVisible();

            const box = await imgLocator.boundingBox();
            expect(box).toBeDefined();

            const boxWidth = Math.round(box!.width);
            const expectedWidth = viewPortSize.width;

            expect(boxWidth).toStrictEqual(expectedWidth);
        }
    },
    {
        name: 'Fixed size images dimensions remain unchanged when the window size changes unless too small',
        imgSelector: `[alt~="fixed-size"]`,
        viewportSizes: (_ignored: Locator) => {
            return [
                {
                    width: 1024,
                    height: 4096
                },
                {
                    width: 48,
                    height: 4096
                }
            ]
        },
        waiter: async (_ignored: string, _ignoredTwo: Page, imgLocator: Locator) => await expect(imgLocator).toBeVisible(),
        test: async (_ignored: string, _ignoredTwo: string, previousSize: Size, _ignoredThree: Size, viewPortSize: Size, imgLocator: Locator) => {
            const box = await imgLocator.boundingBox();
            expect(box).toBeDefined();

            const boxWidth = Math.round(box!.width);
            const boxHeight = Math.round(box!.height);

            if (viewPortSize.width === 48) {
                expect(boxWidth).toStrictEqual(viewPortSize.width);
                expect(boxHeight).toStrictEqual(previousSize.height);
            } else {
                expect(boxWidth).toStrictEqual(previousSize.width);
                expect(boxHeight).toStrictEqual(previousSize.height);
            }
        }
    }
]

responsiveTests(testInfo => testInfo.project.metadata.HTML_RESPONSIVE_DOCUMENT_PATH, "Check responsive sizing OF SVG elements", TESTS, async (page) => {
    const summaries = page.locator('summary');
    const count = await summaries.count();

    for (let i = 0; i < count; i++) {
        await summaries.nth(i).click();
    }
});