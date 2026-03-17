export type Animal = {
  id: number;
  name: string;
  buy_price: number;
  sell_price: number | null;
  status: "ready" | "sold";
  owner_id: string;
};

export type AnimalWithProfit = Animal & {
  profit: number;
};