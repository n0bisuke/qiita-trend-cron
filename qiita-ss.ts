import puppeteer from 'puppeteer';
import {setTimeout} from "node:timers/promises";

import fs from 'node:fs';
const QIITA_URL = 'https://qiita.com'; //ログインしてないとホームがトレンドになる
const SS_FILE_PATH = 'screenshot.png';

//Discord Webhook Post
const discordPost = async (filePath = `screenshot.png`) => {
    const DiscordWebhookURL = process.env.DISCORD_WEBHOOK_URL || '';

    //送信するデータ1
    const payload = {
        username: 'QiitaトレンドチェックBOT',
        content: 'Qiitaのトレンド通知です。'
    };

    try {
        const file = fs.readFileSync(filePath)
        const formData = new FormData()
        formData.append('file', new Blob([file], { type: 'image/png' }), 'file.png')
        formData.append("payload_json", JSON.stringify(payload));

        const response = await fetch(DiscordWebhookURL, {
            method: 'POST',
            body: formData
        });
    
        return response.json();
    } catch (error) {
        console.log(error);
    }

}

(async () => {

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--lang=ja']
    });
      
    const page = await browser.newPage();
    await page.goto(QIITA_URL);
    // 表示まで少し待機
    await setTimeout(1000);
    await page.screenshot({ path: SS_FILE_PATH, fullPage: true });
    console.log('Screenshot saved!');

    await setTimeout(2000);
    const res = await discordPost(SS_FILE_PATH);
    console.log(res);

    await browser.close();
}
)();
