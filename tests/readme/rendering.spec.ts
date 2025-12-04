import { Browser, Page, TestInfo } from "@playwright/test";
import fetchSvgContent from "../../utils/fetch-svg-content";
import { RenderingProperties, renderingTest, Size } from "../test.rendering";

renderingTest(testInfo => testInfo.project.metadata.HTML_README_PATH, 'README.md - Rendering test', 'readme', {
    startWidth: 1200,
    minWidth: 256,
    widthStep: 128,
    height: 2304,
    beforeInitHook: async (page: Page, browser: Browser, _testInfo: TestInfo, _properties: RenderingProperties, currentSize: Size) => {
        await page.route('**/*', async (route, request) => {
            const browserName = browser.browserType().name();
            const browserVersion = browser.version();

            if (request.resourceType() !== 'image') {
                return route.continue();
            }

            const response = await fetchSvgContent(request.url());

            if (!response || !response.includes('svg')) {
                return route.continue();
            }

            const adaptedSvg = await page.evaluate((response) => {
                const parser = new DOMParser();
                const document = parser.parseFromString(response, 'image/svg+xml');
                const svg = document.querySelector('svg');

                if (!svg?.hasAttribute('width')) {
                    return null;
                }

                return svg?.outerHTML;
            }, response);

            if (!adaptedSvg) {
                return route.continue();
            }

            const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(adaptedSvg || "");
            const tempPage = await page.context().newPage();

            try {
                await tempPage.setViewportSize({ width: currentSize.width, height: currentSize.height });
                await tempPage.goto(dataUrl);

                const svgLocator = tempPage.locator('svg').first();
                await svgLocator.waitFor();

                await svgLocator.evaluate((svg: SVGSVGElement) => {
                    svg.pauseAnimations();
                    svg.setCurrentTime(50);
                    svg.setCurrentTime(50);
                });

                let requestUrl = request.url().replace(/[^a-zA-Z0-9]/g, '-');
                requestUrl = requestUrl.length <= 60 ? requestUrl : requestUrl.slice(0, 30) + "..." + requestUrl.slice(-30);

                return route.fulfill({
                    status: 200,
                    headers: { 'Content-Type': 'image/png' },
                    body: await svgLocator.screenshot({ path: `tests/screenshots/readme/rendering/${browserName}/${browserName}-${browserVersion}-w${currentSize.width}-${requestUrl}.png`, scale: 'css' }),
                });
            } finally {
                tempPage.close();
            }
        });
    }
});