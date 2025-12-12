import { Browser, expect, Locator, Page, TestInfo } from '@playwright/test';
import { ImageResponsiveTest, responsiveTests, BoundingBox } from '../test.responsive';
import { test } from '../test';

const TESTS: ImageResponsiveTest[] = [
    {
        name: 'Full-width and full-height images (100%) change width depending on the size of the window.',
        imgSelector: '[alt~="full-width"],[alt~="full-height"]',
        viewportWidths: (_ignored: Locator) => [1024, 256],
        test: async (
            _ignored: string,
            _ignoredTwo: string,
            _ignoredThree: BoundingBox,
            _currentBoundingBox: BoundingBox,
            viewportWidth: number,
            imgLocator: Locator
        ) => {
            const boundingBoxWidth = Math.round((await imgLocator.boundingBox())!.width);

            expect(boundingBoxWidth).toStrictEqual(viewportWidth);
        },
    },
    {
        name: 'Fixed size images dimensions remain unchanged when the window size changes unless too small',
        imgSelector: '[alt~="fixed-size"]',
        viewportWidths: (_ignored: Locator) => [1024, 48],
        test: async (
            _ignored: string,
            _ignoredTwo: string,
            previousBoundingBox: BoundingBox,
            _ignoredThree: BoundingBox,
            viewportWidth: number,
            imgLocator: Locator,
            _page: Page,
            browser: Browser,
            testInfo: TestInfo
        ) => {
            if (browser.browserType().name() === 'webkit' && testInfo.project.use.headless === false) test.skip();

            const boundingBoxWidth = Math.round((await imgLocator.boundingBox())!.width);

            if (viewportWidth === 48) {
                expect(boundingBoxWidth).toStrictEqual(viewportWidth);
            } else {
                expect(boundingBoxWidth).toStrictEqual(Math.round(previousBoundingBox.width));
            }
        },
    },
    {
        name: 'Fixed size images dimensions are rendered as is',
        imgSelector: '[alt~="fixed-size"]',
        viewportWidths: (_ignored: Locator) => [1024, 4096],
        test: async (
            _ignored: string,
            _ignoredTwo: string,
            _previousBoundingBox: BoundingBox,
            _ignoredThree: BoundingBox,
            _viewportWidth: number,
            imgLocator: Locator
        ) => {
            const definedWidth =
                Number((await imgLocator.getAttribute('width'))?.replace('px', '')) ||
                (await imgLocator.evaluate((img: HTMLImageElement) => img.naturalWidth));
            const definedHeight =
                Number((await imgLocator.getAttribute('height'))?.replace('px', '')) ||
                (await imgLocator.evaluate((img: HTMLImageElement) => img.naturalHeight));

            const boundingBoxWidth = (await imgLocator.boundingBox())!.width;
            const boundingBoxHeight = (await imgLocator.boundingBox())!.height;

            if (definedWidth) {
                expect(definedWidth).toStrictEqual(Math.round(boundingBoxWidth));
            }

            if (definedHeight) {
                expect(definedHeight).toStrictEqual(Math.round(boundingBoxHeight));
            }
        },
    },
    {
        name: 'Fixed size images maintain their bounding box when viewport width changes',
        imgSelector: '[alt~="fixed-size"]',
        viewportWidths: (_ignored: Locator) => [1024, 768, 512, 256],
        test: async (
            _ignored: string,
            _ignoredTwo: string,
            previousBoundingBox: BoundingBox,
            currentBoundingBox: BoundingBox,
            _viewportWidth: number,
            imgLocator: Locator
        ) => {
            const currentBoundingBoxWidth = Math.round(currentBoundingBox.width);
            const currentBoundingBoxHeight = Math.round(currentBoundingBox.height);

            const previousBoundingBoxWidth = Math.round(previousBoundingBox.width);
            const previousBoundingBoxHeight = Math.round(previousBoundingBox.height);

            expect(currentBoundingBoxWidth).toStrictEqual(previousBoundingBoxWidth);
            expect(currentBoundingBoxHeight).toStrictEqual(previousBoundingBoxHeight);
        },
    },
];

responsiveTests(
    (testInfo) => testInfo.project.metadata.DOCUMENTS_PATHS.HTML_RESPONSIVE_PATH,
    'Check responsive sizing OF SVG elements',
    TESTS,
    async (page) => {
        const summaries = page.locator('summary');
        const count = await summaries.count();

        for (let i = 0; i < count; i++) {
            await summaries.nth(i).click();
        }
    }
);
