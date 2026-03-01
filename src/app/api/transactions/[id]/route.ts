import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

type Context = {
  params: Promise <{
    id: string;
  }>;
};

export async function GET(_: Request, context: Context) {
  const { id } = await context.params;
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request, context: Context) {
  const { id } = await context.params;
  const body = await req.json()

  const { data, error } = await supabase
    .from("transactions")
    .update(body)
    .eq("id", id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_: Request, context: Context) {
  const { id } = await context.params;
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}