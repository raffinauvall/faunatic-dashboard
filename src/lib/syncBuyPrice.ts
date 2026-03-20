import { supabase } from "@/lib/supabase";

export default async function syncBuyPrice(animal_id: string) {
  const { data } = await supabase
    .from("transactions")
    .select("amount")
    .eq("animal_id", animal_id)
    .eq("type", "beli_hewan")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  await supabase
    .from("animals")
    .update({ buy_price: data?.amount || 0 })
    .eq("id", animal_id);
}