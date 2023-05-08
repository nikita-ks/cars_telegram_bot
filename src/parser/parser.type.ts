import { Logger } from '@nestjs/common';
import { Browser } from 'puppeteer';
import { TBaseResponse } from 'src/parser/types';

export abstract class Parser<D> {
  browser: Browser;
  constructor(public logger: Logger) {}
  abstract parse(vinCode: string): Promise<TBaseResponse<D>>;
  init(browser: Browser): void {
    this.browser = browser;
  }
}
