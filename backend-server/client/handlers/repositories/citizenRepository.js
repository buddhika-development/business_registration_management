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

export async function createCitizen({ nic, fullname, passwordhash }) {
    const { data, error } = await adminClient
        .from('citizens')
        .insert({ nic, fullname, passwordhash })
        .select('id, nic, fullname, role, isactive, createdat')
        .single();

    if (error) throw error;
    return data;
}