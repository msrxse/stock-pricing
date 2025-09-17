import type { StocksAggregates } from "@/types";

export function LineChart({
  stocksAggregates,
}: {
  stocksAggregates: StocksAggregates[];
}) {
  return <div>{JSON.stringify(stocksAggregates[0])}</div>;
}
