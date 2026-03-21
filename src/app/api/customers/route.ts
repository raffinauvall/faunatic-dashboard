import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("customers")
        .select(`
            *,
            transactions (
                type,
                amount,
                transaction_date
            )
            `)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, phone } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Nama wajib diisi" },
                { status: 400 }
            );
        }

        let existingCustomer = null;

        if (phone) {
            const { data } = await supabase
                .from("customers")
                .select("*")
                .eq("phone", phone)
                .maybeSingle();

            existingCustomer = data;
        }

        if (existingCustomer) {
            return NextResponse.json(existingCustomer);
        }

        const { data, error } = await supabase
            .from("customers")
            .insert({
                name,
                phone,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);

    } catch (err: any) {
        console.error("CUSTOMER ERROR:", err);

        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}