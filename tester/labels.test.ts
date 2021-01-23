import { getElementsByText } from "./getElementsByText";

const puppeteer = require('puppeteer');
const serverData = require('../server/data.json');
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

describe("labels", () => {

  const flatDeep = (arr) => {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), [])
  };

  test('labels are rendered', async () => {
    await goToMainPage();

    let allLabels = serverData.map(item => item.labels).filter(item => !!item);

    allLabels = flatDeep(allLabels);

    const labelElements = await getElementsByText(allLabels, page)

    expect(labelElements.length).toBeGreaterThanOrEqual(15)
  });
});

