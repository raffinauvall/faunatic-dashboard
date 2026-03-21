import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Context = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_: Request, context: Context) {

    const { id } = await context.params;
    const { data, error } = await supabase 
    .from("customers")
    .select(
        `
      *,
      transactions (
        id,
        type,
        amount,
        transaction_date,
        status_order,
        payment_status,
        animal_request,
        animals (
          name
        )
      )
    `
    ) 
    .eq("id", id)
    .single();

    if(error) {
        return NextResponse.json({message: error.message}, {status: 404 });
    };
     const transactions =
    data.transactions?.sort(
      (a: any, b: any) =>
        new Date(b.transaction_date).getTime() -
        new Date(a.transaction_date).getTime()
    ) || [];

  const total_spend = transactions
    .filter((t: any) => t.type === "jual_hewan")
    .reduce((acc: number, t: any) => acc + (t.amount || 0), 0);

  const total_order = transactions.filter(
    (t: any) => t.type === "jual_hewan"
  ).length;

  return NextResponse.json({
    ...data,
    transactions,
    total_spend,
    total_order,
  });
}