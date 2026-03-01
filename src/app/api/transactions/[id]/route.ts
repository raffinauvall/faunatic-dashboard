import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

type Params = {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: Params) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("transactions")
    .update(body)
    .eq("id", params.id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: Params) {
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}