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

export const getDocumentsWithProvidersByApplicationNo = async (id) => {
    const { data, error } = await adminClient
        .from("document_providers_with_documents")
        .select("*")
        .eq("applicationno", id);

    if (error) throw error;
    return data;
};


export const getValidBusinesses = async () => {
    const { data: appNos, error: viewError } = await adminClient
        .from("business_all_docs_valid")
        .select("applicationno");

    if (viewError) throw viewError;

    const applicationNumbers = appNos.map(item => item.applicationno);

    if (applicationNumbers.length === 0) return [];

    const { data, error } = await adminClient
        .from("business")
        .select("*")
        .in("applicationno", applicationNumbers);

    if (error) throw error;
    return data;
};


export const getBusinessesWithUnapprovedDocs = async () => {
    const { data: appNos, error } = await adminClient
        .from("business_all_docs_pending")
        .select("applicationno");

    if (error) throw error;

    const applicationNumbers = appNos.map(item => item.applicationno);
    if (!applicationNumbers.length) return [];

    const { data: businesses, error: bizError } = await adminClient
        .from("business")
        .select("*")
        .in("applicationno", applicationNumbers);

    if (bizError) throw bizError;

    const { data: unapprovedDocs, error: docError } = await adminClient
        .from("documents")
        .select("*")
        .in("applicationno", applicationNumbers)
        .neq("document_authenticity", "approved");

    if (docError) throw docError;

    return businesses.map(biz => ({
        ...biz,
        unapprovedDocuments: unapprovedDocs.filter(doc => doc.applicationno === biz.applicationno)
    }));
};
