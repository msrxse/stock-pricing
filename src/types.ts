export interface ListTickets {
  active?: boolean;
  cik?: string;
  composite_figi?: string;
  currency_name?: string;
  last_updated_utc?: string;
  locale: string;
  market: string;
  name: string;
  primary_exchange?: string;
  share_class_figi?: string;
  ticker: string;
  type?: string;
}

export interface StocksAggregates {
  v: number; // volume
  vw?: number; // volume weighted average price
  o: number; // open price
  c: number; // close price
  h: number; // high price
  l: number; // low price
  t: number; // timestamp
  n?: number; // number of transactions
}

export interface StocksAggregatesObject {
  [key: string]: StocksAggregates[];
}

// Derive OHLC keys
export type PriceTypeKeys = keyof Pick<StocksAggregates, "o" | "h" | "l" | "c">;
