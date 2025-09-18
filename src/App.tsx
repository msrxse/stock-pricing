import { useEffect, useState } from "react";

import { restClient } from "@polygon.io/client-js";
import { Toolbar } from "@/components/Toolbar";
import type {
  ListTickets,
  PriceTypeKeys,
  StocksAggregatesObject,
} from "@/types";
import { LineChart } from "@/components/LineChart";

function App() {
  const rest = restClient(
    import.meta.env.VITE_POLY_API_KEY,
    "https://api.polygon.io"
  );
  const [listTickets, setListTickets] = useState<ListTickets[]>([]);
  const [stocksAggregates, setStocksAggregates] =
    useState<StocksAggregatesObject>({});
  const [priceType, setPriceType] = useState<PriceTypeKeys>("o");

  async function getStocksAggregates(ticket: string) {
    try {
      const response = await rest.getStocksAggregates(
        ticket, // ticker
        1, // multiplier
        "day", // timespan
        "2024-01-09", // from
        "2025-02-10", // to
        { adjusted: true, sort: "asc", limit: 120 } // optional query params
      );
      setStocksAggregates({
        ...stocksAggregates,
        [ticket]: response.results || [],
      });
    } catch (e) {
      console.error("An error happened:", e);
    }
  }

  async function getListTickers() {
    try {
      const response = await rest.listTickers({
        market: "stocks",
        exchange: "XNYS",
        active: "true",
        order: "asc",
        limit: "100",
        sort: "ticker",
      } as any);

      setListTickets(response.results || []);
    } catch (e) {
      console.error("An error happened:", e);
    }
  }

  useEffect(() => {
    getListTickers();
  }, []);

  return (
    <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh bg-gray-50">
      <Toolbar
        listTickets={listTickets}
        stocksAggregates={stocksAggregates}
        getStocksAggregates={getStocksAggregates}
        priceType={priceType}
        setPriceType={setPriceType}
      />
      <div className="h-100 border-b border-gray-200 bg-white shadow-sm">
        <LineChart
          stocksAggregates={stocksAggregates}
          priceType={priceType}
          width={800}
          height={350}
        />
      </div>
    </main>
  );
}

export default App;
