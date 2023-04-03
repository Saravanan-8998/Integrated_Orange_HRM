import { chromium, Browser, Page } from '@playwright/test';

const browserContext = async (): Promise<{ browser: Browser, page: Page }> => {
    let browser = await chromium.launch();
    let page = await browser.newPage();
    await page.goto('./');
    return { browser, page };
};

export const myBrowserFixture = browserContext;