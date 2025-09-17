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
  getStocksAggregates: () => void;
}) {
  return (
    <div className="h-10 border border-gray-500">
      <>
        <Select onValueChange={(value) => getStocksAggregates()}>
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
