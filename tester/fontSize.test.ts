import { getElementsByText } from "./getElementsByText";

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

describe("font size", () => {

  test.skip('Normal font is the default', async () => {
    await goToMainPage();
    const tickets = await page.$$('.tickets li')
    let fontSize = await page.evaluate(el => getComputedStyle(el).fontSize, tickets[0])
    const numFontSize = fontSize.match(/\d+[\.]+\d+/ig);
    expect(Number(numFontSize)).toBe(16);
  });

  test('font buttons exists', async () => {
    await goToMainPage();

    const buttons = await getElementsByText([
      'small font', 'Small font', 'Small Font',
      'normal font', 'Normal font', 'Normal Font',
      'large font', 'Large font', 'Large Font',
    ], page)

    expect(buttons.length).toBe(3);
  });

  test('Small button affects font size', async () => {
    await goToMainPage();

    const buttons = await getElementsByText(['small font', 'Small font', 'Small Font'], page)
    await buttons[0].click();
    const tickets = await page.$$('.tickets li')
    let fontSize = await page.evaluate(el => getComputedStyle(el).fontSize, tickets[0])
    const numFontSize = fontSize.match(/\d+[\.]+\d+/ig);
    expect(Number(numFontSize)).toBeLessThan(16);
  });

  test('Normal button affects font size', async () => {
    await goToMainPage();

    let buttons = await getElementsByText(['small font', 'Small font', 'Small Font'], page)
    await buttons[0].click();

    buttons = await getElementsByText(['normal font', 'Normal font', 'Normal Font'], page)
    await buttons[0].click();

    const tickets = await page.$$('.tickets li')
    let fontSize = await page.evaluate(el => getComputedStyle(el).fontSize, tickets[0])
    expect(fontSize).toBe('16px');
  });

  test('Large button affects font size', async () => {
    await goToMainPage();
    const buttons = await getElementsByText(['large font', 'Large font', 'Large Font'], page)
    await buttons[0].click();
    const tickets = await page.$$('.tickets li')
    let fontSize = await page.evaluate(el => getComputedStyle(el).fontSize, tickets[0])
    const numFontSize = fontSize.match(/\d+[\.]+\d+/ig);
    expect(Number(numFontSize)).toBeGreaterThan(16);
  });

});

