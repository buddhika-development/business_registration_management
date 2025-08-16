import { adminClient } from "../../../libs/supabaseClient.js";

export async function getProprietorByNic(nic) {
    const { data, error } = await adminClient
        .from('proprietor')
        .select('nic, fullname, addressline1, addressline2, city, dsdivision')
        .eq('nic', nic)
        .maybeSingle();
    if (error) throw error;
    return data;
}

export async function getPropertyOwnerAndPremises(applicationNo) {
    const { data, error } = await adminClient
        .from('premises')
        .select('owner_name, addressline1, addressline2, city')
        .eq('applicationno', applicationNo)
        .maybeSingle();
    if (error) throw error;
    return data;
}
