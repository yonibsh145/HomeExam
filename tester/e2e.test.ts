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

describe("Clone", () => {

  test('20 clone buttons are rendered', async () => {
    await goToMainPage();
    const cloneButtons = await page.$$('.cloneButton')
    expect(cloneButtons.length).toBe(20)
  });

  test('Clone button text', async () => {
    await goToMainPage();
    const cloneButtons = await page.$$('.cloneButton')
    let value = await page.evaluate(el => el.textContent, cloneButtons[0])
    expect(value).toBe('Clone')
  });

  test('Clone an item', async () => {
    await goToMainPage();
    const cloneButtons = await page.$$('.cloneButton')
    await cloneButtons[0].click();
    const titles = await page.$$('.title')
    expect(titles.length).toBe(21)
  });
});

