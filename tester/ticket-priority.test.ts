const puppeteer = require('puppeteer');
import { staticsUrl } from '@fed-exam/config';
import { eventually } from '@unidriver/core';

import * as unidriver from '@unidriver/puppeteer';
import { getElementsByText } from './getElementsByText';

import { readFileSync } from 'fs';


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

const getUpdatedServerData = () => {
  return JSON.parse(readFileSync('../server/data.json', 'utf8'))
}

describe("Ticket priorities", () => {

const priorityToString = {
    20: 'normal',
    30: 'high'
};

  test('the right priorities are rendered', async () => {
    await goToMainPage();

    const driver = unidriver.pupUniDriver({page, selector: 'body'});
    const ticketTexts = (await driver.$$('.tickets .ticket footer').text()).map(c => c.toLocaleLowerCase());

    const expectedPriorities = getUpdatedServerData().map(t => priorityToString[t.priority] || 'normal').slice(0, ticketTexts.length);

    for (const idx in ticketTexts) {
      expect(ticketTexts[idx]).toContain(expectedPriorities[idx])
    }
        
  });

  test('clicking on the priority will toggle the visible priority', async () => {
    await goToMainPage();

    const driver = unidriver.pupUniDriver({page, selector: 'body'});

    const priorityElements = await getElementsByText(['normal', 'Normal', 'high', 'High'], page);


    const idxToToggle = Math.floor(Math.random() * priorityElements.length);

    const currentElem = priorityElements[idxToToggle];

    const currentPriority = await page.evaluate(el => el.textContent, currentElem);

    await currentElem.click();

    const actualPriority = await page.evaluate(el => el.textContent, currentElem);
    const expectedPriority = currentPriority.toLowerCase() === 'normal' ? 'high' : 'normal';

    expect(actualPriority.toLowerCase()).toBe(expectedPriority);
        
  });

  test('clicking on the priority will toggle the visible priority - returns to same priority after double toggle', async () => {
    await goToMainPage();

    const driver = unidriver.pupUniDriver({page, selector: 'body'});

    const priorityElements = await getElementsByText(['normal', 'Normal', 'high', 'High'], page);


    for (const idx in priorityElements) {
  
      const currentElem = priorityElements[idx];
  
      const currentPriority = await page.evaluate(el => el.textContent, currentElem);
  
      await currentElem.click();
      await currentElem.click();
  
      const actualPriority = await page.evaluate(el => el.textContent, currentElem);
      const expectedPriority = actualPriority.toLowerCase();
  
      expect(actualPriority.toLowerCase()).toBe(expectedPriority);

    }
        
  });

  test('change of priority is persisted to the db', async () => {
    await goToMainPage();

    const currentServerData = getUpdatedServerData();

    const driver = unidriver.pupUniDriver({page, selector: 'body'});

    const priorityElements = await getElementsByText(['normal', 'Normal', 'high', 'High'], page);


    const idxToToggle = Math.floor(Math.random() * priorityElements.length);

    const currentElem = priorityElements[idxToToggle];

    const currentPriority = currentServerData[idxToToggle].priority || 20;

    await currentElem.click();

    const expectedPriority = currentPriority === 30 ? 20 : 30;
    await eventually(() => {
      const newServerData = getUpdatedServerData();

      expect(newServerData[idxToToggle].priority).toBe(expectedPriority)
    });
        
  });


});

