import { Parser, pageViewPort } from 'src/parser/constants';
import { TUcarsResponse } from 'src/parser/types';

const ucarsScraperData = {
  name: 'UCARS',
  baseUrl: 'https://ucars.pro/search',
  vehicleCardSelector: '.vehicle-card',
  saleDateSelector: 'a.vehicle-card__thumb .d-flex.align-items-center span:last-child',
  priceSelector: '.vehicle-card__bid .vehicle-card__bid-digits',
  specsSelector: '.vehicle-card__content .vehicle-card__specs .vehicle-card__specs-item',
  specItemNameSelector: '.vehicle-card__specs-name',
  specItemValueSelector: '.vehicle-card__specs-value',
};

export class UcarsParser extends Parser<TUcarsResponse[]> {
  async parse(vinCode: string) {
    this.logger.log(`parsing resource: ${ucarsScraperData.name}`);

    const page = await this.browser.newPage();
    await page.goto(`${ucarsScraperData.baseUrl}/${vinCode}`);
    await page.setViewport(pageViewPort);
    await page.waitForSelector(ucarsScraperData.vehicleCardSelector);

    const result: TUcarsResponse[] = await page.$$eval(
      ucarsScraperData.vehicleCardSelector,
      (element, ucarsScraperData) => {
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
      },
      ucarsScraperData,
    );

    const response = { title: ucarsScraperData.name, data: result };
    return response;
  }
}
