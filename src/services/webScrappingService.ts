import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export async function webScrappingService(url: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const content = await page.content();

    const $ = cheerio.load(content);

    await browser.close();

    const title = $('.pdp-info-right h1').text();

    let price: string | number = '';
    const priceStr = $('.pdp-info-right [class^="price-default--current"]')
        .text()
        .trim()
        .toUpperCase()
        .split('R$')[1]
        .replace(',', '.');

    price = Math.round(Number(priceStr) * 100);

    const photoUrl = $('.pdp-info-left [class^="image-view-v2--previewBox"] img').attr(
        'src'
    );

    return { title, price, photoUrl, link: url };
}
