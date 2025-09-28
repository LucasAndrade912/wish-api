import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

import { DomainNotSupportedException } from '../exceptions/domainNotSupportedException';

export async function webScrappingService(url: string) {
    const supportedDomains = ['https://pt.aliexpress.com/'];

    if (!supportedDomains.some((domain) => url.startsWith(domain))) {
        throw new DomainNotSupportedException();
    }

    const urlWithoutParams = url.split('?')[0];

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(urlWithoutParams);
    const content = await page.content();

    const $ = cheerio.load(content);

    await browser.close();

    const title = $('.pdp-info-right h1').text();

    let price: string | number = '';
    let priceStr = $('.pdp-info-right [class^="price-default--current"]')
        .text()
        .trim()
        .toUpperCase();

    const priceMatch = priceStr.match(/R\$[\d.,]+/);

    if (priceMatch) {
        priceStr = priceMatch[0].replace('R$', '').replace(/\./g, '').replace(',', '.');
    }

    price = Math.round(Number(priceStr) * 100);

    const photoUrl = $('.pdp-info-left [class^="image-view-v2--previewBox"] img').attr(
        'src'
    );

    return { title, price, photoUrl, link: url };
}
