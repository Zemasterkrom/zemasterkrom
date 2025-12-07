import { getAverageColor } from "fast-average-color-node";
import { ColorSchemeTest, colorSchemeTests } from "../test.colors";
import { expect, Locator, Page } from "@playwright/test";
import { intToRGBA, Jimp } from "jimp";
import { imageSizeFromFile } from 'image-size/fromFile'

const TESTS: ColorSchemeTest[] = [
    {
        name: "Switches to color theme correctly",
        selector: '[alt~="theme"][alt~="dark-mode[dark-bg]"][alt~="light-mode[light-bg]"]',
        screenshot: true,
        test: {
            dark: async (_page: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    algorithm: 'dominant'
                }));

                expect(dominantColor.isDark).toBeTruthy();
            },
            light: async (_page: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    algorithm: 'dominant'
                }));

                expect(dominantColor.isLight).toBeTruthy();
            }
        }
    },
    {
        name: "Responsive sizing - Stretches the blue image horizontally (fixed size)",
        selector: '[alt~="fixed-size"][alt~="fixed-width"][alt~="fixed-height"][alt~="responsive-sizing"]',
        screenshot: true,
        test: {
            light: async (_page: Page, _locator: Locator, screenshotPath: string) => {
                const image = await Jimp.read(screenshotPath);
                const hex = image.getPixelColor(64, 0);
                const { r, g, b, a } = intToRGBA(hex);

                expect(r).not.toStrictEqual(255);
                expect(g).not.toStrictEqual(255);
                expect(b).not.toStrictEqual(255);
                expect(a).toStrictEqual(255);
            }
        }
    },
    {
        name: "Responsive sizing - Stretches the blue image horizontally (full width, fixed height)",
        selector: '[alt~="full-width"][alt~="fixed-height"][alt~="responsive-sizing"]',
        screenshot: true,
        test: {
            light: async (_page: Page, _locator: Locator, screenshotPath: string) => {
                const image = await Jimp.read(screenshotPath);
                const hex = image.getPixelColor(128, 0);
                const { r, g, b, a } = intToRGBA(hex);

                expect(r).not.toStrictEqual(255);
                expect(g).not.toStrictEqual(255);
                expect(b).not.toStrictEqual(255);
                expect(a).toStrictEqual(255);
            }
        }
    },
    {
        name: "SVG and HTML - Builds and shows the rounded rectangle shape correctly",
        selector: '[alt~="svg-styling"][alt~="html"]',
        screenshot: true,
        test: {
            light: async (_page: Page, _locator: Locator, screenshotPath: string) => {
                const dimensions = await imageSizeFromFile(screenshotPath);

                const image = await Jimp.read(screenshotPath);
                const hex = image.getPixelColor(0, dimensions.height);
                const { r, g, b, a } = intToRGBA(hex);

                expect(r).toStrictEqual(255);
                expect(g).toStrictEqual(255);
                expect(b).toStrictEqual(255);
                expect(a).toStrictEqual(255);
            }
        }
    },
];

colorSchemeTests(testInfo => testInfo.project.metadata.DOCUMENTS_PATHS.HTML_RESPONSIVE_PATH, 'Color scheme testing', 'responsive', TESTS, async (page) => {
    const summaries = page.locator('summary');
    const count = await summaries.count();

    for (let i = 0; i < count; i++) {
        await summaries.nth(i).click();
    }
});