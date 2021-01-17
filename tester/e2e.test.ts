const puppeteer = require('puppeteer');
const serverData = require('../server/data.json');
import { staticsUrl } from '@fed-exa/config';

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({
        width: 1280,
        height: 1080,
        deviceScaleFactor: 1,
    });
})

afterAll(async () => {
    await browser.close();
})

const goToMainPage = async () => {
    await page.goto(staticsUrl);
    //await page.screenshot({ path: 'main_page.png' });
}

describe("Titles", () => {

    test('20 titles are rendered', async () => {
        await goToMainPage();
        const titles = await page.$$('.title')

        let value = await page.evaluate(el => el.textContent, titles[0])
        expect(titles.length).toBe(20)
    });

    test('first title content is correct', async () => {
        await goToMainPage();
        const titles = await page.$$('.title')

        let value = await page.evaluate(el => el.textContent, titles[0])
        expect(value).toBe(serverData[0].title)
    });

    test('last title content is correct', async () => {
        await goToMainPage();
        const titles = await page.$$('.title')

        let value = await page.evaluate(el => el.textContent, titles[titles.length - 1])
        expect(value).toBe(serverData[titles.length - 1].title)
    });

});

describe("font size", () => {

  test('Normal class name is rendered', async () => {
    await goToMainPage();
    const tickets = await page.$$('.tickets li')

    let elementClass = await page.evaluate(el => el.className, tickets[0])
    expect(elementClass).toContain('normal')
  });

  test('Small class affects font size', async () => {
    await goToMainPage();
    const smallButton = await page.$('#small')
    await smallButton.click();
    const tickets = await page.$$('.tickets li')
    let fontSize = await page.evaluate(el => getComputedStyle(el).fontSize, tickets[0])
    const numFontSize = fontSize.match(/\d+[\.]+\d+/ig);
    expect(Number(numFontSize)).toBeLessThan(16);
  });

  test('Large class affects font size', async () => {
    await goToMainPage();
    const smallButton = await page.$('#large')
    await smallButton.click();
    const tickets = await page.$$('.tickets li')
    let fontSize = await page.evaluate(el => getComputedStyle(el).fontSize, tickets[0])
    const numFontSize = fontSize.match(/\d+[\.]+\d+/ig);
    expect(Number(numFontSize)).toBeGreaterThan(16);
  });

});

