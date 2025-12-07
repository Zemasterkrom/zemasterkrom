import { TestInfo } from "@playwright/test";
import { crossContainsFont, SvgFontTest, fontTests } from "../test.fonts";

const TESTS: SvgFontTest[] = [
    {
        name: 'Loads font consistently',
        svgSelector: '[alt~="font"]',
        innerTextSelector: 'div, text',
        fontStack: (testInfo) => testInfo.project.metadata.FONT_STACK,
        fontExtractor: (element: Element) => getComputedStyle(element).fontFamily,
        test: async (_ignored: TestInfo, fontFamilies: string[][], availableFonts: string[]) => crossContainsFont(fontFamilies, availableFonts)
    }
];

fontTests(testInfo => testInfo.project.metadata.DOCUMENTS_PATHS.HTML_RESPONSIVE_PATH, "Font loading testing", TESTS, async (page) => {
    const summaries = page.locator('summary');
    const count = await summaries.count();

    for (let i = 0; i < count; i++) {
        await summaries.nth(i).click();
    }
});