
import { expect, Locator, Page } from '@playwright/test';
import { intToRGBA, Jimp } from 'jimp';
import { getAverageColor } from 'fast-average-color-node';
import { ColorSchemeTest, colorSchemeTests } from '../test.colors';

const TESTS: ColorSchemeTest[] = [
    {
        name: "Preview README.md - Switches to color theme correctly",
        selector: '[alt="Preview README.md"]',
        screenshot: true,
        test: {
            dark: async (_page: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    algorithm: 'dominant'
                }));

                expect(dominantColor.isDark).toBeTruthy();
            },
            light: async (_ignored: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    algorithm: 'dominant'
                }));

                expect(dominantColor.isLight).toBeTruthy();
            }
        }
    },
    {
        name: "Preview README.md - Correctly shows the pattern element",
        selector: '[alt="Preview README.md"]',
        screenshot: true,
        test: {
            dark: async (_ignored: Page, _locator: Locator, screenshotPath: string) => {
                const image = await Jimp.read(screenshotPath);
                const hex = image.getPixelColor(164, 0);
                const { r, g, b, a } = intToRGBA(hex);

                expect(r).toBeLessThanOrEqual(160);
                expect(g).toBeLessThanOrEqual(160);
                expect(b).toBeLessThanOrEqual(160);
                expect(a).toStrictEqual(255);
            },
            light: async (_ignored: Page, _locator: Locator, screenshotPath: string) => {
                const image = await Jimp.read(screenshotPath);
                const hex = image.getPixelColor(164, 0);
                const { r, g, b, a } = intToRGBA(hex);

                expect(r).not.toBeGreaterThanOrEqual(250);
                expect(g).not.toBeGreaterThanOrEqual(250);
                expect(b).not.toBeGreaterThanOrEqual(250);
                expect(a).toStrictEqual(255);
            }
        }
    },
    {
        name: "Number of installs of zmkr-cloudflare-turnstile-bundle - Switches to color correctly",
        selector: '[alt*="Number of zmkr-cloudflare-turnstile-bundle installs"]',
        screenshot: true,
        test: {
            dark: async (_ignored: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    algorithm: 'dominant'
                }));

                expect(dominantColor.isLight).toBeTruthy();
            },
            light: async (_ignored: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    ignoredColor: [255, 255, 255, 255, 25],
                    algorithm: 'simple'
                }));

                expect(dominantColor.isDark).toBeTruthy();
            }
        }
    },
    {
        name: "View all projects - Switches to color correctly",
        selector: '[alt="View all projects"]',
        screenshot: true,
        test: {
            dark: async (_ignored: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    algorithm: 'dominant'
                }));

                expect(dominantColor.isDark).toBeTruthy();
            },
            light: async (_ignored: Page, _locator: Locator, screenshotPath: string) => {
                const dominantColor = (await getAverageColor(screenshotPath, {
                    algorithm: 'dominant'
                }));

                expect(dominantColor.isLight).toBeTruthy();
            }
        }
    }
];

colorSchemeTests(testInfo => testInfo.project.metadata.HTML_README_PATH, 'Color scheme testing', 'readme', TESTS);