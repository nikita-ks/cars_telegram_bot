export const pageViewPort = { width: 1080, height: 1024 };
export const waitForNavigationKey = 'networkidle2';

export const ucarsScraperData = {
  name: 'UCARS',
  baseUrl: 'https://ucars.pro/search',
  vehicleCardSelector: '.vehicle-card',
  saleDateSelector: 'a.vehicle-card__thumb .d-flex.align-items-center span:last-child',
  priceSelector: '.vehicle-card__bid .vehicle-card__bid-digits',
  specsSelector: '.vehicle-card__content .vehicle-card__specs .vehicle-card__specs-item',
  specItemNameSelector: '.vehicle-card__specs-name',
  specItemValueSelector: '.vehicle-card__specs-value',
};

export const bidfaxScraperData = {
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

export const vehicleHistoryScraperData = {
  name: 'Vehicle History',
  baseUrl: 'https://www.vehiclehistory.com/vin-report',
};

export const KBBScraperData = {
  name: 'KBB',
  baseUrl: 'https://www.kbb.com',
  vinCodeBaseUrl: 'https://vingurus.com/ru/landing/checkout?vin=',
  vinCodeDecoderSelector: '#outline > div > div.outline-main > h2',
};
