import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

type Context = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Context) {
  const { id } = params;
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: Context) {
  const { id } = params;
  const body = await req.json()

  const { data, error } = await supabase
    .from("animals")
    .update(body)
    .eq("id", id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: Context) {
  const { id } = params;
  const { error } = await supabase
    .from("animals")
    .update({ is_deleted: true })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}