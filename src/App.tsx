import { useEffect, useState } from "react";

import { restClient } from "@polygon.io/client-js";
import { Toolbar } from "@/components/Toolbar";
import type { ListTickets } from "@/types";

function App() {
  const rest = restClient(import.meta.env.VITE_POLY_API_KEY);
  const [listTickets, setListTickets] = useState<ListTickets[] | undefined>();

  async function exampleListTickers() {
    try {
      const response = await rest.listTickers({
        market: "stocks",
        exchange: "XNYS",
        active: "true",
        order: "asc",
        limit: "100",
        sort: "ticker",
      });
      setListTickets(response.results);
    } catch (e) {
      console.error("An error happened:", e);
    }
  }

  useEffect(() => {
    const response = exampleListTickers();

    console.log("Response:", response);
    return () => console.log("unmounting...");
  }, []);

  return (
    <main className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh">
      <Toolbar listTickets={listTickets} />
      <div className="h-80 border border-gray-500 border-t-0">
        Main contents
      </div>
    </main>
  );
}

export default App;
