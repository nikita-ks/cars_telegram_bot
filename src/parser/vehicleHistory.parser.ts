import { Parser } from 'src/parser/parser.type';

import { TVehicleHistoryResponse } from 'src/parser/types';

const vehicleHistoryScraperData = {
  name: 'Vehicle History',
  baseUrl: 'https://www.vehiclehistory.com/vin-report',
};

export class VehicleHistoryParser extends Parser<TVehicleHistoryResponse[]> {
  async parse(vinCode: string) {
    return {
      title: vehicleHistoryScraperData.name,
      data: [{ link: `${vehicleHistoryScraperData.baseUrl}/${vinCode}` }],
    };
  }
}
