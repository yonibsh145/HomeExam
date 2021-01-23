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

describe("Sort list items", () => {

  test('Sort Button exist', async () => {
    await goToMainPage();
    const els = await getElementsByText([
      'sort by title',
      'Sort by title',
      'Sort By title',
      'Sort By Title',

      'sort by date',
      'Sort by date',
      'Sort By date',
      'Sort By Date',
    ], page)

    expect(els.length).toBe(2)
  });
});

