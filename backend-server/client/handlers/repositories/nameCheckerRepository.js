import { adminClient } from "../../../libs/supabaseClient.js";

export async function findBusinessByName(name) {
    const { data, error } = await adminClient
        .from("business")
        .select("*")
        .ilike("businessname", name);

    if (error) {
        console.error("Supabase error:", error);
        throw new Error("Database query failed");
    }

    return data;
}
