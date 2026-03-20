export interface Transaction {
  id: string;
  type: string;
  amount: number;
  transaction_date: string;
  created_at?: string;
  users?: {
    id: string;
    name: string;
  };
  animals?: {
    id: string;
    name: string;
  } | null;
}