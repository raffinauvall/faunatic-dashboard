import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server"

type Params = {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: Params) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("users")
    .update(body)
    .eq("id", params.id)
    .select()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: Params) {
  const { error } = await supabase
    .from("users")
    .update({ is_deleted: true })
    .eq("id", params.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}