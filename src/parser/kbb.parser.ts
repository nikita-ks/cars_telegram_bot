import { Parser } from 'src/parser/parser.type';

import { TKBBResponse } from 'src/parser/types';

const KBBScraperData = {
  name: 'KBB',
  baseUrl: 'https://www.kbb.com',
  vinCodeBaseUrl: 'https://vingurus.com/ru/landing/checkout?vin=',
  vinCodeDecoderSelector: '#outline > div > div.outline-main > h2',
};

export class KBBParser extends Parser<TKBBResponse[]> {
  async parse(vinCode: string) {
    const urlVinDecoder = `${KBBScraperData.vinCodeBaseUrl}${vinCode}`;
    const page = await this.browser.newPage();
    await page.goto(urlVinDecoder);

    this.logger.log(`parsing resource: ${urlVinDecoder}`);
    // TODO: add trycatch
    const vinCodeData = await page.waitForSelector(KBBScraperData.vinCodeDecoderSelector);

    const [year, name, model] = (await vinCodeData.evaluate((el) => el.textContent)).toLowerCase().split(' ');
    const link = `${KBBScraperData.baseUrl}/${name}/${model}/${year}/`;

    return { title: KBBScraperData.name, data: [{ link }] };
  }
}
