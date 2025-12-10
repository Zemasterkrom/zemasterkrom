import { expect, Page, TestInfo } from "@playwright/test";
import PlaywrightFontStackDetector from "../utils/playwright-font-detection-helper";
import fetchSvgContent from "../utils/fetch-svg-content";
import { htmlMediaInfo, test, testStepDescription } from "./test";

export type SvgFontTest = {
    name: string;
    svgSelector: string;
    innerTextSelector: string;
    fontStack: (testInfo: TestInfo) => string[];
    fontExtractor: (element: Element) => string | null;
    initHook?: (page: Page) => Promise<void>;
    test: (testInfo: TestInfo, fontFamilies: string[][], availableFonts: string[]) => Promise<void>;
}

export async function crossContainsFont(fontFamilies: string[][], availableFonts: string[]): Promise<void> {
    fontFamilies.forEach(fontList => {
        const matchedFont = fontList.find((font: string) => availableFonts.includes(font));
        expect(matchedFont).toBeDefined();
    });
}

export async function fontTests(urlProvider: (testInfo: TestInfo) => string, describeName: string, fontTests: SvgFontTest[], initHook?: (page: Page) => Promise<void>): Promise<void> {
    test.describe(describeName, () => {
        fontTests.forEach((fontTest) => {
            test(fontTest.name, async ({ page }, testInfo) => {
                const fontDetector = new PlaywrightFontStackDetector(page.context());
                const availableFonts = await fontDetector.detect(fontTest.fontStack(testInfo));
                await page.goto(urlProvider(testInfo));
                await page.addStyleTag({ content: 'html,body{height:100%;overflow:hidden;margin:0;padding:0;}' });
                if (initHook) await initHook(page);

                const svgLocator = page.locator(fontTest.svgSelector);
                const context = page.context();
                const svgSrcs = await svgLocator.evaluateAll(elements => elements.map(element => (element as HTMLImageElement).getAttribute('src')).filter(Boolean) as string[]);
                expect(svgSrcs.length).toBeGreaterThan(0);

                for (let i = 0; i < svgSrcs.length; i++) {
                    let svgSrc = svgSrcs[i];
                    const mediaInfo = await htmlMediaInfo(svgLocator.nth(i), i);

                    await test.step(await testStepDescription(mediaInfo), async () => {
                        const svgContent = await fetchSvgContent(svgSrc);
                        const svgTestPage = await context.newPage();
                        await svgTestPage.setContent(svgContent);

                        const fontFamilies = await svgTestPage.evaluate(({ innerTextSelector: textSelector, fontExtractorCode }) => {
                            const elements = document.querySelectorAll(textSelector);
                            const extractor = eval(fontExtractorCode);

                            return Array.from(elements).map(element => {
                                const fontFamily = extractor(element);
                                return fontFamily ? fontFamily.split(',').map((s: string) => s.trim().replace(/^["'](.*)["']$/, '$1')) : [];
                            }).filter(fonts => fonts.length > 0);
                        }, {
                            innerTextSelector: fontTest.innerTextSelector,
                            fontExtractorCode: `(${fontTest.fontExtractor.toString()})`
                        });

                        await fontTest.test(testInfo, fontFamilies, availableFonts);
                        await svgTestPage.close().catch(() => { });
                    });
                }
            });
        });
    });
}