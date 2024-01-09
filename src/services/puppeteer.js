import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import Handlebars from 'handlebars';

export default async (data) => {
  const invoicePath = path.join(path.resolve(), 'src/views/invoice.pdf');
  const html = fs.readFileSync(
    path.join(path.resolve(), 'src/views/invoice.hbs'),
    'utf8',
  );
  const template = Handlebars.compile(html)(data);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
    executablePath: '/usr/bin/google-chrome',
  });

  const page = await browser.newPage();
  await page.setContent(template, { waitUntil: 'networkidle0' });
  await page.pdf({ format: 'A4', path: invoicePath });
  await browser.close();
};
