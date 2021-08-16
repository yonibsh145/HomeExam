const puppeteer = require('puppeteer');
const serverData = require('../server/data.json');

const host = 'http://localhost'
const staticsPort = 3000;
const staticsUrl = `${host}:${staticsPort}/`;
const serverAPIPort = 3232;
const APIDomain = 'tickets';
const APIPath = `/api/${APIDomain}`;
const APIRootPath = `${host}:${serverAPIPort}${APIPath}`

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

afterEach(async () => {
  try {
    await page.screenshot({
      path: `results/screenshots/${expect.getState().currentTestName}.png`,
      fullPage: true
    });
  } catch (e) {
    console.error('screenshot failed.');
  }
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

