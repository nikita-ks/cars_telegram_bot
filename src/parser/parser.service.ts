import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import {
  TBaseResponse,
  TBidFaxResponse,
  TKBBResponse,
  TParseResources,
  TUcarsResponse,
  TVehicleHistoryResponse,
} from './types';
import {
  KBBScraperData,
  bidfaxScraperData,
  pageViewPort,
  ucarsScraperData,
  vehicleHistoryScraperData,
  waitForNavigationKey,
} from 'src/parser/constants';

@Injectable()
export class ParserService {
  //TODO: add exception decorator "withtrycatch"
  logger: Logger = new Logger('ParserService');
  browser: Browser;
  private async initBrowser() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  private async parseUcars(vinCode: string): Promise<TBaseResponse<TUcarsResponse[]>> {
    this.logger.log(`parsing resource: ${ucarsScraperData.name}`);

    const page = await this.browser.newPage();
    await page.goto(`${ucarsScraperData.baseUrl}/${vinCode}`);
    await page.setViewport(pageViewPort);
    await page.waitForSelector(ucarsScraperData.vehicleCardSelector);

    const result: TUcarsResponse[] = await page.$$eval(ucarsScraperData.vehicleCardSelector, (element) => {
      const data: Record<string, TUcarsResponse> = {};

      element.forEach((el) => {
        const saleDate = el.querySelector(ucarsScraperData.saleDateSelector)?.textContent;
        const price = el.querySelector(ucarsScraperData.priceSelector)?.textContent;
        const specs = el.querySelectorAll(ucarsScraperData.specsSelector);

        data[saleDate] = { saleDate, price } as TUcarsResponse;
        Array.from(specs).forEach((spec) => {
          const key = spec.querySelector(ucarsScraperData.specItemNameSelector)?.textContent;
          const value = spec.querySelector(ucarsScraperData.specItemValueSelector)?.textContent;
          if (key && value) {
            data[saleDate][key.toLowerCase()] = value;
          }
          return data;
        });
      });
      return Object.values(data);
    });

    const response = { title: ucarsScraperData.name, data: result };
    return response;
  }

  private async parseBidfax(vinCode: string): Promise<TBidFaxResponse[]> {
    this.logger.log(`parsing resource: ${bidfaxScraperData.name}`);

    let result: TBidFaxResponse[] = [];
    const page = await this.browser.newPage();
    const inputSelector = bidfaxScraperData.inputSelector;
    const searchBtnSelector = bidfaxScraperData.searchBtnSelector;

    await page.setViewport(pageViewPort);
    await page.setExtraHTTPHeaders(bidfaxScraperData.extraHeaders);
    await page.goto(bidfaxScraperData.url);
    await page.waitForSelector(inputSelector);
    await page.type(inputSelector, vinCode);

    await Promise.all([page.click(searchBtnSelector), page.waitForNavigation({ waitUntil: waitForNavigationKey })]);

    result = await page.$$eval(
      bidfaxScraperData.offerSelector,
      // element = offer block
      (element) => {
        const data: Record<string, TBidFaxResponse> = {};
        element.forEach((el) => {
          // el = offer block
          const price = el.querySelector(bidfaxScraperData.priceSelector)?.textContent;
          const allPTags = el.querySelectorAll(bidfaxScraperData.allPTagsSelector);
          const saleDate = el.querySelector(bidfaxScraperData.saleDateSelector)?.textContent;
          allPTags.forEach((p) => {
            const pTextContent = p?.textContent;
            // collect all necessary data
            if (bidfaxScraperData.offerKeysRegexp.test(pTextContent) && saleDate) {
              const [title, value] = pTextContent.split(':');
              data[saleDate] = {
                ...data[saleDate],
                [title]: value,
                saleDate,
                price,
              };
            }
          });
        });
        return Object.values(data);
      },
    );
    return result;
  }

  private async vehicleHistory(vinCode: string): Promise<TBaseResponse<TVehicleHistoryResponse[]>> {
    return {
      title: vehicleHistoryScraperData.name,
      data: [{ link: `${vehicleHistoryScraperData.baseUrl}/${vinCode}` }],
    };
  }

  private async parseKBB(vinCode: string): Promise<TBaseResponse<TKBBResponse[]>> {
    const urlVinDecoder = `${KBBScraperData.vinCodeBaseUrl}${vinCode}`;
    const page = await this.browser.newPage();
    await page.goto(urlVinDecoder);

    this.logger.log(`parsing resource: ${urlVinDecoder}`);

    const vinCodeData = await page.waitForSelector(KBBScraperData.vinCodeDecoderSelector);

    const [year, name, model] = (await vinCodeData.evaluate((el) => el.textContent)).toLowerCase().split(' ');
    const link = `${KBBScraperData.baseUrl}/${name}/${model}/${year}/`;

    return { title: KBBScraperData.name, data: [{ link }] };
  }

  async parseResources(vinCode: string): Promise<TParseResources> {
    await this.initBrowser();
    const result = await Promise.all([this.parseUcars(vinCode), this.parseKBB(vinCode), this.vehicleHistory(vinCode)]);
    this.browser.close();

    return result;
  }
}
