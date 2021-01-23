import { getElementsByText } from "./getElementsByText";
import { staticsUrl } from '@fed-exam/config';
import { sleep } from "./sleep";

const puppeteer = require('puppeteer');

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

describe("Clone an item", () => {
  const cloneButtonTexts = ['clone', 'Clone'];

  test('20 items with "clone" text are rendered', async () => {
    await goToMainPage();
    const cloneButtons = await getElementsByText(cloneButtonTexts, page)

    expect(cloneButtons.length).toBe(20)
  });

  test('Click on Clone element add new item', async () => {
    await goToMainPage();
    const cloneButtons = await getElementsByText(cloneButtonTexts, page)

    await cloneButtons[0].click();
    const titles = await page.$$('.title')
    expect(titles.length).toBe(21)
  });

  test('Clone click clones the right data', async () => {
    await goToMainPage();
    const cloneButtons = await getElementsByText(cloneButtonTexts, page)

    expect(cloneButtons.length).toBe(20)

    await cloneButtons[0].click();
    await sleep(200);

    const titles = await page.$$('.title')

    let value0 = await page.evaluate(el => el.textContent, titles[0])
    let value1 = await page.evaluate(el => el.textContent, titles[1])
    expect(value0).toBe(value1)
  });

});

