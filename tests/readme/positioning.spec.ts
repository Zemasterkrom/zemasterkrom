import { expect } from "@playwright/test";
import { positioningTests, SvgPositioningTest } from "../test.positioning";

const TESTS: SvgPositioningTest[] = [
    {
        name: `Check positioning of "Preview README.md" preview tab image`,
        svgSelector: 'image#preview-tab-dark, image#preview-tab-light',
        test: (positions) => {
            expect(Object.keys(positions).length).toBeGreaterThan(0);

            for (const key of Object.keys(positions)) {
                expect(positions[key].x).toStrictEqual(0);
                expect(positions[key].y).toStrictEqual(0);
            }
        }
    },
    {
        name: `Check positioning of "Preview README.md" container / tabs filler image`,
        svgSelector: 'rect#tabs-bar-filler-dark,rect#tabs-bar-filler-light',
        test: (positions) => {
            expect(Object.keys(positions).length).toBeGreaterThan(0);

            for (const key of Object.keys(positions)) {
                expect(positions[key].x).toBeGreaterThan(0);
                expect(positions[key].y).toStrictEqual(0);
            }
        }
    },
    {
        name: `Check positioning of "Preview README.md" editor actions image`,
        svgSelector: 'image#editor-actions-dark,image#editor-actions-light',
        test: (positions) => {
            expect(Object.keys(positions).length).toBeGreaterThan(0);

            for (const key of Object.keys(positions)) {
                expect(positions[key].x).toStrictEqual(1024);
                expect(positions[key].y).toStrictEqual(0);
            }
        }
    }
];

positioningTests(testInfo => testInfo.project.metadata.HTML_README_PATH, "Check positioning of SVG elements", TESTS);