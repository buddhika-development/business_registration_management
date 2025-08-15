import { adminClient } from "../../../libs/supabaseClient.js";

export const getAllRequests = async () => {
    const { data: businesses, error: businessError } = await adminClient
        .from("business")
        .select("*")
        .order("commencementdate", { ascending: false });
    if (businessError) throw businessError;

    const { data: proprietors, error: propError } = await adminClient
        .from("proprietor")
        .select("nic, fullname");
    if (propError) throw propError;

    return businesses.map(b => {
        const owner = proprietors.find(p => p.nic === b.proprietornic);
        return {
            id: b.applicationno,
            companyName: b.businessname,
            ownerName: owner ? owner.fullname : "",
            businessType: b.businesstype,
            businessCategory: b.businesscategory,
            status: b.applicationstatus,
            requestDate: b.commencementdate,
        };
    });
};

export const getRequestById = async (id) => {
    const { data: business, error: businessError } = await adminClient
        .from("business")
        .select("*")
        .eq("applicationno", id)
        .single();
    if (businessError) throw businessError;

    const { data: owner, error: ownerError } = await adminClient
        .from("proprietor")
        .select("fullname")
        .eq("nic", business.proprietornic)
        .single();
    if (ownerError) throw ownerError;

    return {
        id: business.applicationno,
        companyName: business.businessname,
        ownerName: owner ? owner.fullname : "",
        businessType: business.businesstype,
        businessCategory: business.businesscategory,
        status: business.applicationstatus,
        requestDate: business.commencementdate,
    };
};

export const updateRequestStatus = async (id, status) => {
    const { data: updatedBusiness, error: updateError } = await adminClient
        .from("business")
        .update({ applicationstatus: status })
        .eq("applicationno", id)
        .select()
        .single();
    if (updateError) throw updateError;

    const { data: owner, error: ownerError } = await adminClient
        .from("proprietor")
        .select("fullname")
        .eq("nic", updatedBusiness.proprietornic)
        .single();
    if (ownerError) throw ownerError;

    return {
        id: updatedBusiness.applicationno,
        companyName: updatedBusiness.businessname,
        ownerName: owner ? owner.fullname : "",
        businessType: updatedBusiness.businesstype,
        businessCategory: updatedBusiness.businesscategory,
        status: updatedBusiness.applicationstatus,
        requestDate: updatedBusiness.commencementdate,
    };
};
