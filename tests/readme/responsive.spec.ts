import { expect, Locator, Page } from '@playwright/test';
import { ImageResponsiveTest, responsiveTests, Size } from '../test.responsive';

const TESTS: ImageResponsiveTest[] = [
    {
        name: `"Preview README.md" resizes correctly`,
        imgSelector: `[alt="Preview README.md"]`,
        viewportSizes: (_ignored: Locator) => {
            return [
                {
                    width: 2048,
                    height: 1024
                },
                {
                    width: 256,
                    height: 1024
                }
            ]
        },
        waiter: async (_previousSrc: string, _page: Page, imgLocator: Locator) => await expect(imgLocator).toBeVisible(),
        test: async (_previousSrc: string, _currentSrc: string, previousSize: Size, _currentSize: Size, viewPortSize: Size, imgLocator: Locator) => {
            const result = await imgLocator.evaluate(
                (svg: HTMLElement, args: { viewPortSize: Size; previousSize: Size }) => {
                    const { viewPortSize, previousSize } = args;

                    return (
                        document.body.offsetWidth === viewPortSize.width &&
                        document.body.offsetWidth === svg.offsetWidth &&
                        svg.offsetHeight === previousSize.height
                    );
                },
                { viewPortSize, previousSize }
            );

            expect(result).toBeTruthy();
        }
    },
    {
        name: `Title header switches image correctly based on screen width (quick fix)`,
        imgSelector: `[alt="Zemasterkrom"]`,
        viewportSizes: (_imgLocator: Locator) => {
            return [
                {
                    width: 800,
                    height: 1024
                },
                {
                    width: 700,
                    height: 1024
                },
                {
                    width: 500,
                    height: 1024
                }
            ]
        },
        waiter: async (previousSrc: string, page: Page) => {
            await page.waitForFunction(
                (previousSrc) => {
                    const img = document.querySelector(`img[alt="Zemasterkrom"]`) as HTMLImageElement | null;
                    return !!img && !!img.currentSrc && img.currentSrc !== previousSrc;
                },
                previousSrc,
                { timeout: 5000 }
            )
        },
        test: async (previousSrc: string, currentSrc: string) => {
            expect(currentSrc).toBeTruthy();
            expect(currentSrc).not.toEqual(previousSrc);
        }
    }
]

responsiveTests(testInfo => testInfo.project.metadata.HTML_README_PATH, "Check responsive sizing of SVG elements", TESTS);