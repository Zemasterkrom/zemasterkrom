import { expect, Page } from '@playwright/test';
import { test } from '../test';
import { existsSync, readFileSync, rmSync } from 'fs';
import { JSDOM } from "jsdom";

async function browserFetchWithRetries(page: Page, src: string, retries: number, retryDelayMs: number) {
    try {
        await page.evaluate(async (src) => {
            const res = await fetch(src);

            if (!res.ok) {
                throw {
                    message: `HTTP ${res.status}`,
                    retryAfter: res.headers.get('Retry-After')
                };
            }
        }, src);

        console.log('Fetch succeeded:', src);
    } catch (e: any) {
        if (e.retryAfter) {
            const retryAfterInt = parseInt(e.retryAfter, 10);
            retryDelayMs = !isNaN(retryAfterInt) ? retryAfterInt * 1000 : retryDelayMs;
        }

        if (retries - 1 < 0) {
            console.error('Ignored. Failed fetching', src, e);
            return;
        }

        console.error(`GET failed. Remaining retries : ${retries - 1}:`, src);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        await browserFetchWithRetries(page, src, retries - 1, retryDelayMs);
    }
}

test('Warm up the HTTP cache [avoids concurrent workers caching bug]', async ({ page, cacheRoute }, testInfo) => {
    let document: Document, imgElements: (HTMLImageElement | HTMLSourceElement | SVGImageElement)[] = [], imgSrcs: string[] = [];

    if (process.env.CACHE_WARMUP !== "true") test.skip();

    if (existsSync(cacheRoute.options.baseDir)) rmSync(cacheRoute.options.baseDir, { recursive: true });

    const filePaths: string[] = [
        testInfo.project.metadata.HTML_README_PATH,
        testInfo.project.metadata.HTML_RESPONSIVE_DOCUMENT_PATH
    ];

    for (const filePath of filePaths) {
        await test.step(`Loading and parsing ${filePath}`, async () => {
            document = (new JSDOM(readFileSync(filePath.replace('file:///', ''), 'utf-8')).window.document);
        });

        await test.step(`Collecting image elements references`, async () => {
            imgElements = Array.from(document.querySelectorAll('img, source, image'));
            imgSrcs = [
                ...new Set(
                    imgElements
                        .map((asset) => asset.getAttribute('src') || asset.getAttribute('srcset') || asset.getAttribute('xlink:href') || asset.getAttribute('href'))
                        .filter(src => src !== null)
                        .filter(src => src.startsWith('http://') || src.startsWith('https://'))
                )];
        });

        for (const imgSrc of imgSrcs) {
            await test.step(`Executing GET request on ${imgSrc}`, async () => {
                await browserFetchWithRetries(page, imgSrc, testInfo.project.retries, testInfo.project.metadata.CACHE_WARMER_RETRY_DELAY_MS);
                await new Promise(resolve => setTimeout(resolve, testInfo.project.metadata.CACHE_WARMER_DELAY_MS));
            });
        }
    }

    expect(existsSync(cacheRoute.options.baseDir)).toBeTruthy();
});