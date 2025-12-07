import { Page } from "@playwright/test";
import { renderingTest } from "../test.rendering";

renderingTest(testInfo => testInfo.project.metadata.DOCUMENTS_PATHS.HTML_RESPONSIVE_PATH, 'RESPONSIVE.md - Rendering test', 'responsive', {
    startWidth: 1200,
    minWidth: 256,
    widthStep: 128,
    height: 14080,
    afterInitHook: async (page: Page) => {
        const summaries = page.locator('summary');
        const count = await summaries.count();

        for (let i = 0; i < count; i++) {
            await summaries.nth(i).click();
        }
    }
});