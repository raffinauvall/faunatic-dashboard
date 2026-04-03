import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, users(name), animals(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      type,
      user_id,
      amount = 0,
      animal_id,
      animal_name,
      animal_request,
      customer_id,
      customer_name,
      customer_phone,
      transaction_date,
    } = body;

    let insertedAnimalId: string | null = animal_id ?? null;
    let status_order = "completed";
    let finalCustomerId: string | null = customer_id ?? null;

    // ======================
    // 🔥 HANDLE CUSTOMER
    // ======================
    if (type === "jual_hewan") {
      if (!finalCustomerId && customer_name) {
        const { data: existing } = await supabase
          .from("customers")
          .select("*")
          .eq("phone", customer_phone)
          .maybeSingle();

        if (existing) {
          finalCustomerId = existing.id;
        } else {
          const { data: newCustomer, error } = await supabase
            .from("customers")
            .insert({
              name: customer_name,
              phone: customer_phone,
            })
            .select()
            .single();

          if (error) throw error;

          finalCustomerId = newCustomer.id;
        }
      }

      // ❗ VALIDASI
      if (!finalCustomerId) {
        throw new Error("Customer wajib diisi");
      }
    }

    if (type === "beli_hewan") {
      const { data: newAnimal, error: animalError } =
        await supabase
          .from("animals")
          .insert({
            name: animal_name,
            buy_price: amount,
            status: "ready",
            owner_id: user_id,
          })
          .select()
          .single();

      if (animalError) throw animalError;

      insertedAnimalId = newAnimal.id;
      status_order = "completed";
    }

    // ======================
    // 🔴 JUAL HEWAN
    // ======================
    if (type === "jual_hewan") {
      // ❌ kalau belum ada animal → sourcing
      if (!animal_id) {
        status_order = "sourcing";
      }

      // ✅ kalau ada animal → langsung sold
      if (animal_id) {
        const { data: existingAnimal, error: animalError } =
          await supabase
            .from("animals")
            .select("*")
            .eq("id", animal_id)
            .single();

        if (animalError || !existingAnimal) {
          throw new Error("Animal not found");
        }

        const { error: updateAnimalError } =
          await supabase
            .from("animals")
            .update({
              sell_price: amount,
              status: "sold",
            })
            .eq("id", animal_id);

        if (updateAnimalError) throw updateAnimalError;

        insertedAnimalId = animal_id;
        status_order = "completed";
      }
    }

    // ======================
    // 💾 INSERT TRANSACTION
    // ======================
    const { error: txError } =
      await supabase
        .from("transactions")
        .insert({
          user_id,
          type,
          amount,
          animal_id: insertedAnimalId,
          transaction_date,
          status_order,
          animal_request: animal_request ?? animal_name ?? null,
          customer_id: finalCustomerId,
        });

    if (txError) throw txError;

    return NextResponse.json({
      success: true,
      message: "Transaction created",
    });

  } catch (err: any) {
    console.error("TRANSACTION ERROR:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}