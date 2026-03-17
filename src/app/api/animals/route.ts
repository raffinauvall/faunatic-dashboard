import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("animals")
    .select(`
      *,
      users:owner_id (*)
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
    const result = (data ?? []).map((item) => ({
    ...item,
    profit: item.status == "sold"
    ? (item.sell_price ?? 0) - (item.buy_price ?? 0)
    : 0,
  }))

  return NextResponse.json(result)
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