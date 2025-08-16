import { adminClient } from "../../../libs/supabaseClient.js";

export const getBusinessById = async (id) => {

    const { data, error } = await adminClient
        .from("business")
        .select("*")
        .eq("applicationno", id)
        .maybeSingle();

    if (error) throw error;
    return data;
};

export const getProprietorByBusinessId = async (id) => {
    const { data: business, error: bError } = await adminClient
        .from("business")
        .select("proprietornic")
        .eq("applicationno", id)
        .maybeSingle();
    if (bError) throw bError;
    if (!business || !business.proprietornic) return null;

    const { data: owner, error: oError } = await adminClient
        .from("proprietor")
        .select("*")
        .eq("nic", business.proprietornic)
        .maybeSingle();
    if (oError) throw oError;

    return owner;
};


export const getLocationsByBusinessId = async (id) => {
    const { data, error } = await adminClient
        .from("location")
        .select("*")
        .eq("applicationno", id);
    if (error) throw error;
    return data;
};


export const getDocumentsByBusinessId = async (id) => {
    const { data, error } = await adminClient
        .from("documents")
        .select("*")
        .eq("applicationno", id);

    if (error) throw error;
    return data;
};
