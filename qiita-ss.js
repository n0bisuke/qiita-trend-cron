
const puppeteer = require('puppeteer');
const setTimeout = require("node:timers/promises").setTimeout;

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
    });
      
    const page = await browser.newPage();
    await page.goto('https://developer.chrome.com/');
    // 表示まで少し待機
    await setTimeout(1000);
    await page.screenshot({ path: 'screenshot.png', fullPage: true })
    
    await browser.close();
}
)();
