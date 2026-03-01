import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, users(name), animals(name)")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const body = await req.json();

  const {
    type,
    user_id,
    amount = 0,
    animal_id,
    animal_name,
  } = body;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id)
    .single();

  if (userError || !user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  let newBalance = user.balance ?? 0;
  let insertedAnimalId: string | null = animal_id ?? null;

  try {
    if (type === "deposit") {
      newBalance += amount;
    }

    if (type === "tarik_tunai") {
      newBalance -= amount;
    }

    if (type === "beli_hewan") {
      newBalance -= amount;

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

    if (type === "jual_hewan") {
      const { data: existingAnimal, error: animalError } =
        await supabase
          .from("animals")
          .select("*")
          .eq("id", animal_id)
          .single();

      if (animalError || !existingAnimal)
        throw new Error("Animal not found");

      const profit = amount - existingAnimal.buy_price;

      await supabase
        .from("animals")
        .update({
          sell_price: amount,
          profit,
          status: "sold",
        })
        .eq("id", animal_id);

      newBalance += amount;
      insertedAnimalId = animal_id;
    }

    await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", user_id);

    await supabase.from("transactions").insert({
      user_id,
      type,
      amount,
      animal_id: insertedAnimalId,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}