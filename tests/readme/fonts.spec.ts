import { TestInfo } from "@playwright/test";
import { crossContainsFont, SvgFontTest, fontTests } from "../test.fonts";

const TESTS: SvgFontTest[] = [
    {
        name: 'Preview README.md',
        svgSelector: '[alt="Preview README.md"]',
        innerTextSelector: 'image#preview-tab-dark, image#preview-tab-light',
        fontStack: (testInfo: TestInfo) => testInfo.project.metadata.FONT_STACK,
        fontExtractor: (element: Element) => {
            const href = element.getAttribute('href');
            if (!href?.startsWith('data:image/svg+xml;base64,')) return null;

            const base64Data = href.replace(/^data:image\/svg\+xml;base64,/, '');
            const decodedSvg = atob(base64Data);
            const previewElement = (new DOMParser()).parseFromString(decodedSvg, 'image/svg+xml');

            document.body.innerHTML = previewElement.documentElement.outerHTML || '';

            return getComputedStyle(document.querySelector('tspan[style]') || document.createElement('tspan')).fontFamily || null;
        },
        test: async (_ignored: TestInfo, fontFamilies: string[][], availableFonts: string[]) => crossContainsFont(fontFamilies, availableFonts)
    },
    {
        name: 'number of installs',
        svgSelector: '[alt*="Number of zmkr-cloudflare-turnstile-bundle installs"]',
        innerTextSelector: 'p',
        fontStack: (testInfo: TestInfo) => testInfo.project.metadata.FONT_STACK,
        fontExtractor: (element: Element) => getComputedStyle(element).fontFamily,
        test: async (_ignored: TestInfo, fontFamilies: string[][], availableFonts: string[]) => crossContainsFont(fontFamilies, availableFonts)
    },
    {
        name: 'view all projects button',
        svgSelector: '[alt="View all projects"]',
        innerTextSelector: 'text',
        fontStack: (testInfo: TestInfo) => testInfo.project.metadata.FONT_STACK,
        fontExtractor: (element: Element) => getComputedStyle(element).fontFamily,
        test: async (_ignored: TestInfo, fontFamilies: string[][], availableFonts: string[]) => crossContainsFont(fontFamilies, availableFonts)
    }
];

fontTests(testInfo => testInfo.project.metadata.HTML_README_PATH, "Font loading testing", TESTS);