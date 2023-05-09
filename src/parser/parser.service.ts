import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';
import { Parser } from 'src/parser/parser.type';

import { KBBParser } from 'src/parser/kbb.parser';
import { UcarsParser } from 'src/parser/ucars.parser';
import { VehicleHistoryParser } from 'src/parser/vehicleHistory.parser';
import { TKBBResponse, TParseResources, TUcarsResponse, TVehicleHistoryResponse } from './types';

@Injectable()
export class ParserService {
  //TODO: add exception decorator "withtrycatch"
  logger: Logger = new Logger('ParserService');
  browser: Browser;
  parsers: [Parser<TUcarsResponse[]>, Parser<TKBBResponse[]>, Parser<TVehicleHistoryResponse[]>];

  constructor() {
    this.parsers = [new UcarsParser(this.logger), new KBBParser(this.logger), new VehicleHistoryParser(this.logger)];
  }
  private async initBrowser() {
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.parsers.forEach((parser) => parser.init(this.browser));
  }

  async parseResources(vinCode: string): Promise<TParseResources> {
    await this.initBrowser();
    const result = await Promise.all(this.parsers.map((parser) => parser.parse(vinCode)));
    this.browser.close();
    return result;
  }
}
