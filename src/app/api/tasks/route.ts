import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("date", {ascending: true})

    if(error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

    return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
    const body = await req.json();

    const { name, date } = body

    const { data, error }= await supabase 
    .from("tasks")
    .insert({
        name,
        date,
        status: "todo"
    })
    .select()
    .single()

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
    return NextResponse.json(data)
}

export async function PATCH(req: Request) {

  const { id, status } = await req.json()

  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json(data)
}