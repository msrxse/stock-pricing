import type { ListTickets } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Toolbar({
  listTickets,
  getStocksAggregates,
}: {
  listTickets: ListTickets[] | undefined;
  getStocksAggregates: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 h-12 px-4 border-b border-gray-200 bg-white shadow-sm">
      <>
        <Select onValueChange={(value) => getStocksAggregates(value)}>
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
      </>
    </div>
  );
}
