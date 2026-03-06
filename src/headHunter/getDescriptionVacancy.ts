import { chromium } from 'playwright';
import { E_AGGREGATOR_TYPE, IVacancyInfo } from '../types/vacancies';
import { getBrowser } from '../utils/getBrowser';

const URL_MAP: Record<E_AGGREGATOR_TYPE, (id: string) => string> = {
  [E_AGGREGATOR_TYPE.HH]: (id) => `https://hh.ru/vacancy/${id}`,

  [E_AGGREGATOR_TYPE.GETMATCH]: (id) => `https://getmatch.ru/vacancies/${id}`,
};

const SELECTOR_MAP: Record<E_AGGREGATOR_TYPE, string> = {
  [E_AGGREGATOR_TYPE.HH]: '[data-qa="vacancy-description"]',

  [E_AGGREGATOR_TYPE.GETMATCH]: 'section.b-vacancy-description.markdown',
};

export const getDescriptionVacancy = async ({ id, aggregatorType }: IVacancyInfo) => {
  if (!id) throw new Error('Vacancy id required');

  const browser = await getBrowser();

  const page = await browser.newPage({
    locale: 'ru-RU',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  });

  try {
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();

      if (type === 'image' || type === 'font' || type === 'stylesheet') {
        route.abort();
      } else {
        route.continue();
      }
    });

    const urlBuilder = URL_MAP[aggregatorType];
    const selector = SELECTOR_MAP[aggregatorType];

    if (!urlBuilder || !selector) {
      throw new Error('Unsupported aggregator type');
    }

    const url = urlBuilder(id);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    await page.waitForSelector(selector, {
      timeout: 15000,
    });

    const description = await page.$eval(selector, (el) => el.textContent?.trim() || '');

    return description;
  } finally {
    await page.close();
  }
};
