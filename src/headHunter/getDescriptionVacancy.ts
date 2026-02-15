import { chromium } from 'playwright';

const HH_LINK_TEMPLATE = 'https://hh.ru/vacancy/';

export const getDescriptionVacancy = async (id: string) => {
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage({
    locale: 'ru-RU',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });

  await page.goto(`${HH_LINK_TEMPLATE}${id}`, {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('[data-qa="vacancy-description"]', {
    timeout: 15000,
  });

  const description = await page.textContent('[data-qa="vacancy-description"]');

  await browser.close();

  return description;
};
