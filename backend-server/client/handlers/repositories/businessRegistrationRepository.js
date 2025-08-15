import { adminClient } from "../../../libs/supabaseClient.js";

export async function insertApplicationNo(applicationNo) {
    const { data, error } = await adminClient
        .from('business')
        .insert({ applicationno: applicationNo })
        .select('applicationno')
        .single();

    if (error) throw error;
    return data.applicationno;
}