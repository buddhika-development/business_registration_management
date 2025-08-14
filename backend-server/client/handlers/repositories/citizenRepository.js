import { adminClient } from "../../../libs/supabaseClient.js";

export async function findCitizenByNIC(nic) {
    const { data, error } = await adminClient
        .from('citizens')
        .select('id, nic, fullname, passwordhash, role, isactive')
        .eq('nic', nic)
        .maybeSingle();

    if (error) throw error;
    return data;
}