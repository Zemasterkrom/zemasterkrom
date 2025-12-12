import { expect } from '@playwright/test';
import { positioningTests, SvgPositioningTest } from '../test.positioning';

const TESTS: SvgPositioningTest[] = [
    {
        name: `Check positioning of "Preview README.md" preview tab image`,
        svgSelector: '[alt="Preview README.md"]',
        innerSvgSelector: '.preview-tab image',
        test: (positions) => {
            expect(Object.keys(positions).length).toBeGreaterThan(0);

            for (const key of Object.keys(positions)) {
                expect(positions[key].x).toStrictEqual(0);
                expect(positions[key].left).toStrictEqual(0);
                expect(positions[key].y).toStrictEqual(0);
                expect(positions[key].top).toStrictEqual(0);
            }
        },
    },
    {
        name: `Check positioning of "Preview README.md" container / fluid filler image`,
        svgSelector: '[alt="Preview README.md"]',
        innerSvgSelector: '.fluid-filler image',
        test: (positions) => {
            expect(Object.keys(positions).length).toBeGreaterThan(0);

            for (const key of Object.keys(positions)) {
                expect(positions[key].x).toStrictEqual(0);
                expect(positions[key].left).toStrictEqual(0);
                expect(positions[key].y).toStrictEqual(0);
                expect(positions[key].top).toStrictEqual(0);
            }
        },
    },
    {
        name: `Check positioning of "Preview README.md" editor actions image`,
        svgSelector: '[alt="Preview README.md"]',
        innerSvgSelector: '.editor-actions image',
        test: (positions) => {
            expect(Object.keys(positions).length).toBeGreaterThan(0);

            for (const key of Object.keys(positions)) {
                expect(positions[key].x).toBeGreaterThan(0);
                expect(positions[key].right).toStrictEqual(1024);
                expect(positions[key].y).toStrictEqual(0);
                expect(positions[key].top).toStrictEqual(0);
            }
        },
    },
];

positioningTests((testInfo) => testInfo.project.metadata.DOCUMENTS_PATHS.HTML_README_PATH, 'Check positioning of SVG elements', TESTS);
