import { expect } from '@playwright/test';
import { test } from '../test';
import { existsSync, readFileSync, rmSync } from 'fs';
import { JSDOM } from "jsdom";

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
            imgSrcs = imgElements.map((asset) => asset.getAttribute('src') || asset.getAttribute('srcSet') || asset.getAttribute('href')).filter(src => src !== null).filter(src => src.startsWith('http://') || src.startsWith('https://'));
        });

        for (const imgSrc of imgSrcs) {
            await test.step(`Executing GET request on ${imgSrc}`, async () => {
                await page.evaluate(async (imgSrc) => await fetch(imgSrc), imgSrc);
            });
        }
    }

    expect(existsSync(cacheRoute.options.baseDir)).toBeTruthy();
});