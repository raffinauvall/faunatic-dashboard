import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: users, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("user_id, type, amount");

  const result = users.map((user) => {
    const userTx = transactions?.filter((t) => t.user_id === user.id) || [];

    const balance = userTx.reduce((acc, tx) => {
      if (tx.type === "deposit" || tx.type === "jual_hewan") {
        return acc + tx.amount;
      }
      if (tx.type === "beli_hewan") {
        return acc - tx.amount;
      }
      return acc;
    }, 0);

    return {
      ...user,
      balance,
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("users")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}