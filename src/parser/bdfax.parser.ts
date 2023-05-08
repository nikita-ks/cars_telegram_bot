import { pageViewPort, waitForNavigationKey } from 'src/parser/constants';
import { Parser } from 'src/parser/parser.type';
import { TBidFaxResponse } from 'src/parser/types';

const bidfaxScraperData = {
  name: 'BIDFAX',
  url: 'https://en.bidfax.info',
  extraHeaders: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    Cookie:
      // eslint-disable-next-line max-len
      'FORT=beff683e485e8d8f9be2181168cb012f; _ga=GA1.2.2043249600.1677859567; PHPSESSID=68cb7e4b80d1f3abbd94ed0e0a1bb808; _gid=GA1.2.788526255.1680217645; searchkey=de704cbe62d452065c5cc8d0521c5d00',
  },
  inputSelector: '.top_bidfax #search',
  searchBtnSelector: '.top_bidfax #submit',
  offerSelector: '#dle-content .thumbnail.offer',
  priceSelector: '.price',
  allPTagsSelector: '.caption p',
  saleDateSelector: '.caption .short-story:last-of-type .blackfont',
  offerKeysRegexp: /(Condition|Damage|Mileage)/i,
};

export class BidfaxParser extends Parser<TBidFaxResponse[]> {
  async parse(vinCode: string) {
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
    return { title: 'BIDFAX', data: result };
  }
}
