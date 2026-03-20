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
      transaction_date,
    } = body;

    let insertedAnimalId: string | null = animal_id ?? null;

    // ======================
    // BELI HEWAN
    // ======================
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
    }

    // ======================
    // JUAL HEWAN
    // ======================
    if (type === "jual_hewan") {
      const { data: existingAnimal, error: animalError } =
        await supabase
          .from("animals")
          .select("*")
          .eq("id", animal_id)
          .single();

      if (animalError || !existingAnimal) {
        throw new Error("Animal not found");
      }

      const profit = amount - existingAnimal.buy_price;

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
    }

    const { error: txError } =
      await supabase
        .from("transactions")
        .insert({
          user_id,
          type,
          amount,
          animal_id: insertedAnimalId,
          transaction_date,
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