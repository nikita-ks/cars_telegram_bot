export type TBaseResponse<D> = {
  title: string;
  data: D;
};
type TBaseResponseData = {
  price: string;
  saleDate: string;
};

export type TUcarsResponse = TBaseResponseData & {
  odometer: string;
  damage: string;
  condition: string;
  title: string;
};

export type TBidFaxResponse = TBaseResponseData & {
  price: string;
  saleDate: string;
  odometer: string;
  damage: string;
  condition: string;
  title: string;
};

export type TVehicleHistoryResponse = {
  link: string;
};

export type TKBBResponse = {
  link: string;
};

export type TParseResources = (
  | TBaseResponse<TUcarsResponse[]>
  | TBaseResponse<TKBBResponse[]>
  | TBaseResponse<TVehicleHistoryResponse[]>
)[];
