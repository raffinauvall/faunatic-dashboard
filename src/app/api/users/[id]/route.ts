import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server"

type Context = {
  params: {
    id: string;
  };
};

async function GET(req: Request, { params }: Context) {
  const { id } = params;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: Context) {
  const { id } = params;
  const body = await req.json()

  const { data, error } = await supabase
    .from("users")
    .update(body)
    .eq("id", id)
    .select()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: Context) {
  const { id } = params;
  const { error } = await supabase
    .from("users")
    .update({ is_deleted: true })
    .eq("id", id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}