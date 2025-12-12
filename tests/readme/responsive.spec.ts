import { expect, Locator, Page } from '@playwright/test';
import { BoundingBox, ImageResponsiveTest, responsiveTests } from '../test.responsive';

const TESTS: ImageResponsiveTest[] = [
    {
        name: `Visual Studio Code workspace bar responsively resizes`,
        imgSelector: `[alt="Preview README.md"]`,
        viewportWidths: (_imgLocator: Locator) => [2048, 256],
        test: async (
            _previousSrc: string,
            _currentSrc: string,
            previousBoundingBox: BoundingBox,
            _currentBoundingBox: BoundingBox,
            viewportWidth: number,
            imgLocator: Locator,
            page: Page
        ) => {
            const bodyBoundingBox = (await page.locator('body').boundingBox())!;
            const imgBoundingBox = (await imgLocator.boundingBox())!;

            const bodyWidth = Math.round(bodyBoundingBox.width);
            const imgWidth = Math.round(imgBoundingBox.width);
            const imgHeight = Math.round(imgBoundingBox.height);

            expect(bodyWidth).toStrictEqual(viewportWidth);
            expect(imgWidth).toStrictEqual(viewportWidth);
            expect(imgHeight).toBe(previousBoundingBox.height);
        },
    },
    {
        name: `Title header switches image correctly based on screen width`,
        imgSelector: `[alt="Zemasterkrom"]`,
        viewportWidths: (_imgLocator: Locator) => [800, 700, 500],
        waiter: async (previousSrc: string, page: Page) => {
            await page.waitForFunction(
                (prev) => {
                    const img = document.querySelector<HTMLImageElement>('img[alt="Zemasterkrom"]');
                    return img?.currentSrc && img.currentSrc !== prev;
                },
                previousSrc,
                { timeout: 5000 }
            );
        },
        test: async (previousSrc: string, currentSrc: string) => {
            expect(currentSrc).toBeTruthy();
            expect(currentSrc).not.toEqual(previousSrc);
        },
    },
];

responsiveTests((testInfo) => testInfo.project.metadata.DOCUMENTS_PATHS.HTML_README_PATH, 'Check responsive sizing of SVG elements', TESTS);
