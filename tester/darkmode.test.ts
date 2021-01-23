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

describe("Dark Mode", () => {

  test('dark button exist ', async () => {
    await goToMainPage();

    const darkButtons = await getElementsByText(['dark mode', 'Dark mode', 'Dark Mode', 'darkmode', 'darkMode'], page)
    expect(darkButtons.length).toBe(1)
  });

  test('light button doesnt exist by default', async () => {
    await goToMainPage();

    const lightButtons = await getElementsByText(['light mode', 'Light mode', 'Light Mode', 'lightmode', 'lightMode'], page)
    expect(lightButtons.length).toBe(0)
  });

  test('light button exist after clicking the dark button', async () => {
    await goToMainPage();

    const darkButtons = await getElementsByText(['dark mode', 'Dark mode', 'Dark Mode', 'darkmode', 'darkMode'], page)
    await darkButtons[0].click();

    const lightButtons = await getElementsByText(['light mode', 'Light mode', 'Light Mode', 'lightmode', 'lightMode'], page)
    expect(lightButtons.length).toBe(1)
  });

  test('Background is white and text is grayish without change', async () => {
    await goToMainPage();
    const docBody = await page.$('body')
    const title = await page.$('.title')
    let pageBackGroundColor = await page.evaluate(el => getComputedStyle(el).backgroundColor, docBody)
    let titleColor = await page.evaluate(el => getComputedStyle(el).color, title)
    expect(pageBackGroundColor).toBe('rgb(245, 249, 252)')
    expect(titleColor).toBe('rgb(32, 69, 94)')
  });

  test('Background is black and color is white after click', async () => {
    await goToMainPage();
    const darkButtons = await getElementsByText(['dark mode', 'Dark mode', 'Dark Mode', 'darkmode', 'darkMode'], page)
    await darkButtons[0].click();
    const docBody = await page.$('body')
    const title = await page.$('.title')
    let pageBackGroundColor = await page.evaluate(el => getComputedStyle(el).backgroundColor, docBody)
    let titleColor = await page.evaluate(el => getComputedStyle(el).color, title)
    expect(pageBackGroundColor).toBe('rgb(0, 0, 0)')
    expect(titleColor).toBe('rgb(32, 69, 94)')
  });
});

