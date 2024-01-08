import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: 'new',
    // args: [
    //   '--enable-features=NetworkService',
    //   '--no-sandbox',
    //   '--disable-setuid-sandbox',
    //   '--disable-dev-shm-usage',
    //   '--disable-web-security',
    //   '--disable-site-isolation-trials',
    //   '--disable-features=IsolateOrigins,site-per-process',
    //   '--shm-size=3gb',
    //   '--window-size=412,915',
    //   '--lang=en-US',
    //   // "--single-process"
    //   // '--disable-features=site-per-process'
    // ],
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    executablePath: '/usr/bin/google-chrome',
    // userDataDir: path.resolve('chrome_user_data_local');
    // ignoreDefaultArgs: ['--disable-extensions'],
  });
  console.log(browser);
  const page = await browser.newPage();
  // Navigate the page to a URL
  await page.goto('https://developer.chrome.com/', {waitUntil: 'networkidle0'});
  // Set screen size
  // await page.setViewport({width: 1080, height: 1024});
  // await page.screenshot({path:'shot.png'});
  // const pdf = await page.pdf({ format: 'A4', path: 'new.pdf' });
  //  fs.copyFileSync('new.pdf', path.resolve('copy.pdf'));
   await browser.close();
})();