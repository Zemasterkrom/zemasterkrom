import { expect, Page, TestInfo } from "@playwright/test";
import fetchSvgContent from "../utils/fetch-svg-content";
import { test, testStepDescription } from "./test";

export type SvgPositioningTest = {
    name: string;
    svgSelector: string;
    innerSvgSelector: string;
    test: (positions: Record<string, DOMRect>) => Promise<void> | void;
}

export async function positioningTests(urlProvider: (testInfo: TestInfo) => string, describeName: string, positioningTests: SvgPositioningTest[]): Promise<void> {
    test.describe(describeName, () => {
        async function getPositions(page: Page, svgSelector: string): Promise<Record<string, DOMRect>> {
            const svgLocator = page.locator('svg').nth(0);

            return await svgLocator.evaluate((svg, svgSelector) => {
                let positions: Record<string, DOMRect> = {};
                const elements = svg.querySelectorAll(svgSelector);

                elements.forEach((element) => {
                    positions[element.id] = element.getBoundingClientRect();
                });

                return positions;
            }, svgSelector);
        }

        positioningTests.forEach((positioningTest) => {
            test(positioningTest.name, async ({ page }, testInfo) => {
                await page.goto(urlProvider(testInfo));
                await page.evaluate(() => {
                    document.body.style.margin = '0';
                });
                await page.setViewportSize({ width: 1024, height: page.viewportSize()?.height || 1024 });

                const svgImgLocator = page.locator(positioningTest.svgSelector);
                const svgContent = await fetchSvgContent(await svgImgLocator.getAttribute('src') || '');

                await page.evaluate((svgContent) => {
                    const domParser = new DOMParser();
                    const svgDocument = domParser.parseFromString(svgContent, 'image/svg+xml');
                    svgDocument.documentElement.setAttribute('width', '100%');

                    document.body.innerHTML = svgDocument.documentElement.outerHTML;
                }, svgContent);

                const positions = await getPositions(page, positioningTest.innerSvgSelector);
                const count = Object.keys(positions).length;
                expect(count).toBeGreaterThan(0);

                let index = 0;
                for (let elementId in positions) {
                    index++;

                    await test.step(await testStepDescription({
                        index: index,
                        id: elementId
                    }), async () => {
                        await positioningTest.test(positions);
                    });
                }
            });
        });
    });
}