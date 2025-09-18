import type {
  ListTickets,
  PriceTypeKeys,
  StocksAggregates,
  StocksAggregatesObject,
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function Toolbar({
  listTickets,
  stocksAggregates,
  getStocksAggregates,
  priceType,
  setPriceType,
}: {
  listTickets: ListTickets[] | undefined;
  stocksAggregates: StocksAggregatesObject;
  getStocksAggregates: (value: string) => void;
  priceType: PriceTypeKeys;
  setPriceType: (val: PriceTypeKeys) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    if (Object.keys(stocksAggregates).length >= 3) {
      setError("You can select up to 3 tickers only.");
      return;
    }

    getStocksAggregates(value);
    setError(null);
  };

  return (
    <div className="flex items-center gap-4 h-12 px-4 border-b border-gray-200 bg-white shadow-sm">
      <>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {(listTickets || []).map((ticket) => (
              <SelectItem key={ticket.ticker} value={ticket.ticker}>
                {ticket.ticker}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
        )}
      </>
      {/* Price type select */}
      <div className="ml-auto">
        <Select
          value={priceType}
          onValueChange={(val) => setPriceType(val as keyof StocksAggregates)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select price type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="o">Open (o)</SelectItem>
            <SelectItem value="h">High (h)</SelectItem>
            <SelectItem value="l">Low (l)</SelectItem>
            <SelectItem value="c">Close (c)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
