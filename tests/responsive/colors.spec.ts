import { getAverageColor } from "fast-average-color-node";
import { ColorSchemeTest, colorSchemeTests } from "../test.colors";
import { expect, Locator, Page } from "@playwright/test";

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
];

colorSchemeTests(testInfo => testInfo.project.metadata.HTML_RESPONSIVE_DOCUMENT_PATH, "Color scheme testing", TESTS, async (page) => {
    const summaries = page.locator('summary');
    const count = await summaries.count();

    for (let i = 0; i < count; i++) {
        await summaries.nth(i).click();
    }
});