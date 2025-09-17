import type { StocksAggregatesObject } from "@/types";

export function LineChart({
  stocksAggregates,
}: {
  stocksAggregates: StocksAggregatesObject;
}) {
  return <div>{JSON.stringify(Object.keys(stocksAggregates))}</div>;
}
