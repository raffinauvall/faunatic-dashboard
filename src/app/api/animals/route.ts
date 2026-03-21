import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("animals")
    .select(`
      *,
      users:owner_id (*),
      transactions (
        type,
        transaction_date
      )
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const result = (data ?? []).map((item: any) => {
    const buyTx = item.transactions
      ?.filter((t: any) => t.type === "beli_hewan")
      ?.sort(
        (a: any, b: any) =>
          new Date(b.transaction_date).getTime() -
          new Date(a.transaction_date).getTime()
      )[0];

    const sellTx = item.transactions
      ?.filter((t: any) => t.type === "jual_hewan")
      ?.sort(
        (a: any, b: any) =>
          new Date(b.transaction_date).getTime() -
          new Date(a.transaction_date).getTime()
      )[0];

    return {
      ...item,
      profit:
        item.status === "sold"
          ? (item.sell_price ?? 0) - (item.buy_price ?? 0)
          : 0,
      buy_date: buyTx?.transaction_date ?? null,
      sell_date: sellTx?.transaction_date ?? null,
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("animals")
    .insert(body)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}