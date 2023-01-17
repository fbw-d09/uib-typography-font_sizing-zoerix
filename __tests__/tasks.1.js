const puppeteer = require("puppeteer");
const path = require('path');
const fs = require('fs');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe('Typography', () => {
    it("Font size should be set for `:root`, in `rem`", async () => {
        const stylesheet = fs
            .readFileSync(path.resolve('./style.css'), 'utf8')
            .replace(/\s/g, '');
        expect(stylesheet).toMatch(/:root{[^}]*font-size:[^}]*rem/)
    });
    it("`Paragragh` tags on page should be of different font sizes", async () => {
        const paragraghFontSize = await page.$$eval('p', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('font-size')));
        const removeDuplicates = [...new Set(paragraghFontSize)];
        expect(removeDuplicates.length).toBeGreaterThan(3);
    });
    it("`Footer` font size should be set", async () => {
        const stylesheet = fs
            .readFileSync(path.resolve('./style.css'), 'utf8')
            .replace(/\s/g, '');
        expect(stylesheet).toMatch(/footer{[^}]*font-size:/)
    });
    it("Font size for `.description` should be set", async () => {
        const stylesheet = fs
            .readFileSync(path.resolve('./style.css'), 'utf8')
            .replace(/\s/g, '');
        expect(stylesheet).toMatch(/\.description{[^}]*font-size:/)
    });
});