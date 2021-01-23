const puppeteer = require('puppeteer');
const serverData = require('../server/data.json');
const nodeFetch = require('node-fetch');
import { APIRootPath , staticsUrl } from '@fed-exam/config';

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

describe("Server search api", () => {

  test('no search param', async () => {
    const res = await nodeFetch(APIRootPath);
    const resJson = await res.json();
    expect(resJson).toStrictEqual(serverData.slice(0, 20))
  });

  test('empty search param', async () => {
    const res = await nodeFetch(`${APIRootPath}?search=`);
    const resJson = await res.json();
    expect(resJson).toStrictEqual(serverData.slice(0, 20))
  });

  test('search value which returns items', async () => {
    const searchValue = 'I have placed'
    const res = await nodeFetch(`${APIRootPath}?search=${searchValue}`);
    const resJson = await res.json();

    expect(resJson).toStrictEqual(serverData.filter(item => item.content.includes(searchValue)).slice(0, 20))
  });

  test('search value which returns an empty array', async () => {
    const searchValue = 'longlonglongInput'
    const res = await nodeFetch(`${APIRootPath}?search=${searchValue}`);
    const resJson = await res.json();

    expect(resJson).toStrictEqual(serverData.filter(item => item.content.includes(searchValue)).slice(0, 20))
  });
});

describe.skip("Client right usage of the search api", () => {

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

  test('no search param', async (done) => {

    await page.setRequestInterception(true);

    let searchApiUsed = false;

    page.on('request', request => {
      request.continue();
      if (request._url === '') {
        searchApiUsed = true;
      }
      console.log(request._url)
    });

    await page.goto(staticsUrl, { waitUntil: 'networkidle2' });

    expect(searchApiUsed).toBe(true)
    //expect(titles.length).toBe(20)
  });
})
