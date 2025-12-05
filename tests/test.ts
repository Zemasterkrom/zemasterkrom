import { test as base, Locator } from '@playwright/test';
import { createHash } from 'node:crypto';
import { CacheRoute } from 'playwright-network-cache';

export type HTMLMediaInfo = {
    index: number;
    id?: string;
    alt?: string;
    src?: string;
    shortenedSrc?: string;
}

export async function testStepDescription(htmlMediaInfo: HTMLMediaInfo): Promise<string> {
    return `Element ${htmlMediaInfo.index}, id = ${htmlMediaInfo.id}, alt = ${htmlMediaInfo.alt}, src = ${htmlMediaInfo.shortenedSrc}`;
}

export async function htmlMediaInfo(locator: Locator, index: number): Promise<HTMLMediaInfo> {
    const baseSrc = await locator.getAttribute('src') || '';

    return {
        index: index + 1,
        id: await locator.getAttribute('id') || '',
        alt: await locator.getAttribute('alt') || '',
        src: baseSrc,
        shortenedSrc: baseSrc.length <= 20 ? baseSrc : baseSrc.slice(0, 10) + "..." + baseSrc.slice(-10)
    };
}

export const test = base.extend<{ cacheRoute: CacheRoute }>({
    cacheRoute: [async ({ page }, use) => {
        const cacheRoute = new CacheRoute(page, {
            buildCacheDir: (ctx) => [
                ctx.hostname,
                createHash("sha512").update(ctx.pathname).digest('hex'),
                ctx.httpMethod,
                ctx.extraDir,
                ctx.httpStatus,
            ]
        });

        await cacheRoute.GET('http://**/*', { ttlMinutes: 2 });
        await cacheRoute.GET('https://**/*', { ttlMinutes: 2 });

        try {
            await use(cacheRoute);
        } finally {
            if (!page.isClosed()) {
                await page.unroute('http://**/*').catch();
                await page.unroute('https://**/*').catch();
            }
        }
    },

    { auto: true }]
});