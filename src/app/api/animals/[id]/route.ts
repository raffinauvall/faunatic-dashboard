import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: Context) {
  const { id } = await context.params;

  const { data, error } = await supabase
    .from("animals")
    .select(`
      *,
      users(name),
      transactions (
        id,
        type,
        transaction_date,
        amount
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // 🔥 MAPPING BUY & SELL DATE
  const buyTx = data.transactions?.find(
    (t: any) => t.type === "beli_hewan"
  );

  const sellTx = data.transactions?.find(
    (t: any) => t.type === "jual_hewan"
  );

  const result = {
    ...data,
    buy_date: buyTx?.transaction_date || null,
    sell_date: sellTx?.transaction_date || null,
  };

  return NextResponse.json(result);
}

export async function PATCH(req: Request, context: Context) {
  const { id } = await context.params;
  const body = await req.json();

  if (body.status) {
    return NextResponse.json(
      { error: "Status tidak boleh diubah langsung" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("animals")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_: Request, context: Context) {
  const { id } = await context.params;
  const { error } = await supabase
    .from("animals")
    .update({ is_deleted: true })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}