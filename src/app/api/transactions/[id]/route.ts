import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import syncBuyPrice  from "@/lib/syncBuyPrice"

type Context = {
  params: Promise<{
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
  const body = await req.json();

  const { data: existing } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  let updateData = { ...body };

  if (existing?.type === "jual_hewan") {
    if (!body.animal_id && !existing.animal_id) {
      updateData.status_order = "sourcing";
    }

    if (body.animal_id) {
      updateData.status_order = "completed";
    }
  }

  const { data, error } = await supabase
    .from("transactions")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.type === "beli_hewan" && data.animal_id) {
    await syncBuyPrice(data.animal_id);
  }

  return NextResponse.json(data);
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