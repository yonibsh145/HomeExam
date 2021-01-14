const puppeteer = require('puppeteer');
const serverData = require('../server/data.json');
const eventually = require('wix-eventually')

import axios from 'axios';

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
  await page.goto('http://localhost:3000/');
  //await page.screenshot({ path: 'main_page.png' });
}

describe("rename tickets", () => {
  test('rename buttons exist', async () => {
    await goToMainPage();
    const renameButtons = await page.$x("//*[contains(text(), 'Rename') or contains(text(), 'rename')]");

    expect(renameButtons.length).toBe(20)
  });

  test('rename opens prompt dialog', async () => {
    await goToMainPage();
    const renameButtons = await page.$x("//*[contains(text(), 'Rename') or contains(text(), 'rename')]");

    const dialogType = new Promise((res, rej) => {
        page.once('dialog', async dialog => {
            await dialog.dismiss();
            res(dialog.type());
        });
    });
    await renameButtons[0].click();

    const type = await dialogType;

    expect(type).toBe('prompt');
  });

  test('renaming changes the item\'s title to the users prompted input without affecting others', async () => {
    await goToMainPage();

    const idxToRename = 5;
    
    const renameButtons = await page.$x("//*[contains(text(), 'Rename') or contains(text(), 'rename')]");
    
    const newTitle = `Bobiatto!`;

    const originalTitles = await page.$$eval('.title', els => els.map(el => el.textContent))
    
    const acceptDialog = new Promise<void>((res, rej) => {
      page.once('dialog', async dialog => {
        dialog.accept(newTitle).then(res, rej);
      });
    });

    await renameButtons[idxToRename].click();

    await acceptDialog;

    const currentTitles =  await page.$$eval('.title', els => els.map(el => el.textContent))

    const expected = originalTitles.map((title, idx) => idx === idxToRename ? newTitle : title);

    expect(currentTitles).toEqual(expected);
  });

  test('bonus / extra mile - renaming changes the item\'s', async () => {
    await goToMainPage();

    const idxToRename = 7;
    
    const renameButtons = await page.$x("//*[contains(text(), 'Rename') or contains(text(), 'rename')]");
    
    const newTitle = `Am I persisted?!`;

    const originalTitles = await page.$$eval('.title', els => els.map(el => el.textContent))
    
    const acceptDialog = new Promise<void>((res, rej) => {
      page.once('dialog', async dialog => {
        dialog.accept(newTitle).then(res, rej);
      });
    });

    await renameButtons[idxToRename].click();

    await acceptDialog;

    

    const renamedTicketInServer = await axios.get('http://localhost:3232/api/tickets')
      .then((res) => res.data)
      .then((tickets) => tickets.find(t => t.title === originalTitles[idxToRename]));

    return eventually(() => {
      expect(renamedTicketInServer.title).toBe(newTitle);
    });

  });

})