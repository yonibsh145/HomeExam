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

describe("pin Unpin", () => {
  const pinButtonTexts = ['Pin', 'pin'];
  const unpinButtonTexts = ['Unpin', 'unpin', 'UnPin', 'unPin'];

  test('pin element exists', async () => {
    await goToMainPage();
    let pinButtons = await getElementsByText(pinButtonTexts, page)

    expect(pinButtons.length).toBe(20)
  });

  test('pin click works', async () => {
    await goToMainPage();
    let pinButtons = await getElementsByText(pinButtonTexts, page)

    let titles = await page.$$('.title')
    let firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[0].title)

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    titles = await page.$$('.title')
    firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[indexToPin].title)
  });

  test('unpin element exists after item pinned', async () => {
    await goToMainPage();
    let pinButtons = await getElementsByText(pinButtonTexts, page)

    let indexToPin = 5;
    await pinButtons[indexToPin].click();
    let unpinButtons = await getElementsByText(unpinButtonTexts, page)

    expect(unpinButtons.length).toBe(1)
  });

  test('unpin element click works', async () => {
    await goToMainPage();
    let pinButtons = await getElementsByText(pinButtonTexts, page)

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    let unpinButtons = await getElementsByText(unpinButtonTexts, page)
    await unpinButtons[0].click();

    let titles = await page.$$('.title')
    let firstTitleValue = await page.evaluate(el => el.textContent, titles[0])
    expect(firstTitleValue).toBe(serverData[0].title)
  });

  test('unpin element disappeared after click', async () => {
    await goToMainPage();
    let pinButtons = await getElementsByText(pinButtonTexts, page)

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    let unpinButtons = await getElementsByText(unpinButtonTexts, page)
    await unpinButtons[0].click();

    unpinButtons = await getElementsByText(unpinButtonTexts, page)
    pinButtons = await getElementsByText(pinButtonTexts, page)

    expect(unpinButtons.length).toBe(0);
    expect(pinButtons.length).toBe(20);
  });

  test('unpin returns the element to the right place', async () => {
    await goToMainPage();
    let pinButtons = await getElementsByText(pinButtonTexts, page)

    let indexToPin = 5;
    await pinButtons[indexToPin].click();

    let unpinButtons = await getElementsByText(unpinButtonTexts, page)
    await unpinButtons[0].click();

    let titles = await page.$$('.title')
    let titleValue = await page.evaluate(el => el.textContent, titles[indexToPin])
    expect(titleValue).toBe(serverData[indexToPin].title)
  });

})

