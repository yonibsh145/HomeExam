const puppeteer = require('puppeteer');
import { staticsUrl } from '@fed-exam/config';

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

describe("Clone", () => {

  test('20 items with "clone" text are rendered', async () => {
    await goToMainPage();
    const cloneButtons = await page.$x("//*[contains(text(), 'clone') or contains(text(), 'Clone')]");

    expect(cloneButtons.length).toBe(20)
  });

  test('Click on Clone element add new item', async () => {
    await goToMainPage();
    const cloneButtons = await page.$x("//*[contains(text(), 'clone') or contains(text(), 'Clone')]");
    await cloneButtons[0].click();
    const titles = await page.$$('.title')
    expect(titles.length).toBe(21)
  });

  test('Clone click clones the right data', async () => {
    await goToMainPage();
    const cloneButtons = await page.$x("//*[contains(text(), 'clone') or contains(text(), 'Clone')]");
    await cloneButtons[0].click();
    const titles = await page.$$('.title')

    let value0 = await page.evaluate(el => el.textContent, titles[0])
    let value20 = await page.evaluate(el => el.textContent, titles[20])
    expect(value0).toBe(value20)
  });

});

