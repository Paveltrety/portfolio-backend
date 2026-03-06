import { chromium, Browser } from 'playwright';

let browser: Browser | null = null;

export const getBrowser = async (): Promise<Browser> => {
  if (!browser) {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // graceful shutdown
    process.on('SIGINT', async () => {
      if (browser) {
        await browser.close();
        browser = null;
      }
      process.exit();
    });

    process.on('SIGTERM', async () => {
      if (browser) {
        await browser.close();
        browser = null;
      }
      process.exit();
    });
  }

  return browser;
};
