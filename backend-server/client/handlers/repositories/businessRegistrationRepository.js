import { adminClient } from "../../../libs/supabaseClient.js";

export async function existsInDB(applicationNo) {
    const { data, error } = await adminClient
        .from('business')
        .select('applicationno')
        .eq('applicationno', applicationNo)
        .maybeSingle();

    if (error) throw error;
    return !!data; // true if exists, false if not
}


export async function insertApplicationNo({ applicationNo, businessType, businessCategory }) {
    const { data, error } = await adminClient
        .from('business')
        .insert({
            applicationno: applicationNo,
            businesscategory: businessCategory,
            businesstype: businessType,
            applicationstatus: 'draft'
        })
        .select('applicationno')
        .single();

    if (error) throw error;
    return data.applicationno;
}


export async function findApplicationNo(applicationNo) {
    const { data, error } = await adminClient
        .from('business')
        .select('applicationno')
        .eq('applicationno', applicationNo)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function checkStatus(applicationNo) {
    const { data, error } = await adminClient
        .from('business')
        .select('applicationstatus')
        .eq('applicationno', applicationNo)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function insertStep2({ applicationNo, businessName, commencementDate, businessDescription, productServices, initialCapital, annualTurnover }) {

    console.log("APPNO:", applicationNo);
    const toMoney = (v) => {
        if (v === null || v === undefined) return null;
        const cleaned = String(v).replace(/,/g, '').trim();
        if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) throw new Error('Invalid amount');
        return cleaned;
    };

    const toDateOnly = (d) => {
        if (!d) return null;
        const iso = new Date(d);
        if (isNaN(iso.getTime())) throw new Error('Invalid date');
        return iso.toISOString().slice(0, 10);
    };

    const payload = {
        businessname: businessName,
        businessdescription: businessDescription,
        productservices: productServices,
        initialcapital: toMoney(initialCapital),
        annualturnover: toMoney(annualTurnover),
        commencementdate: toDateOnly(commencementDate),
        applicationstatus: 'draft',
    };
    console.log(payload);

    const { data, error } = await adminClient
        .from('business')
        .update(payload)
        .eq('applicationno', applicationNo)
        .select('applicationno')
        .maybeSingle();

    if (error) throw error
    if (!data) {
        return { ok: false, status: 404, message: 'Application not found' };
    }
    return data;
}

export async function insertStep2Premises({ tradeLicenseNo, applicationNo, propertyOwnerNic, premisesType, deedNo, pCity, postalCode, gnD, dsD, pDistrict, pProvince, addressLine1, addressLine2 }) {

    const payload = {
        tradelicenseno: tradeLicenseNo,
        applicationno: applicationNo,
        nic: propertyOwnerNic,
        premisestype: premisesType,
        deedno: deedNo,
        city: pCity,
        postalcode: postalCode,
        gndivision: gnD,
        dsdivision: dsD,
        district: pDistrict,
        province: pProvince,
        addressline1: addressLine1,
        addressline2: addressLine2
    }
    const { data, error } = await adminClient
        .from('location')
        .insert(payload)
        .select('tradelicenseno')
        .maybeSingle();

    if (error) throw error
    if (!data) {
        return { ok: false, status: 404, message: 'Something went wrong in premises details.' };
    }
    return data;
}

export async function insertStep2Owner({ propertyOwnerNic, propertyOwnerName, ownershipType, leaseValidity }) {

    const payload = {
        nic: propertyOwnerNic,
        name: propertyOwnerName,
        ownershiptype: ownershipType,
        leasevaliduntil: leaseValidity
    }
    const { data, error } = await adminClient
        .from('propertyowner')
        .insert(payload)
        .select('nic')
        .maybeSingle();

    if (error) throw error
    if (!data) {
        return { ok: false, status: 404, message: 'Something went wrong in property owner details.' };
    }
    return data;
}

export async function insertStep3({ appNo, pNic, pPassportNo, pHonorific, pNameWithInitials, pFullName, pMaidenName, pDateOfBirth, pGender, pMobileNo, pFixedNo, pEmail, pAdd1, pAdd2, pCity, pGs, pDs, pDistrict, pProvince, pPostalCode }) {

    const payload = {
        nic: pNic,
        passportno: pPassportNo,
        honorific: pHonorific,
        namewithinitials: pNameWithInitials,
        fullname: pFullName,
        maidenname: pMaidenName,
        dateofbirth: pDateOfBirth,
        gender: pGender,
        mobileno: pMobileNo,
        fixedno: pFixedNo,
        email: pEmail,
        addressline1: pAdd1,
        addressline2: pAdd2,
        city: pCity,
        postalcode: pPassportNo,
        gndivision: pGs,
        dsdivision: pDs,
        district: pDistrict,
        province: pProvince
    }
    const { data, error } = await adminClient
        .from('proprietor')
        .insert(payload)
        .select('nic')
        .maybeSingle();

    if (error) throw error
    if (!data) {
        return { ok: false, status: 404, message: 'Something went wrong in property owner details.' };
    }
    return data;
}

export async function updateBusiness({ appNo, pNic }) {


    const { data, error } = await adminClient
        .from('business')
        .update('proprietornic', pNic)
        .eq('applicationno', appNo)
        .select('applicationno')
        .maybeSingle()

    if (error) throw error
    if (!data) {
        return { ok: false, status: 404, message: 'Something went wrong in property owner details.' };
    }
    return data;
}

export async function getBusinessByApplicationNo(applicationNo) {
    const { data, error } = await adminClient
        .from('business')
        .select('applicationno, businesscategory, proprietornic')
        .eq('applicationno', applicationNo)
        .maybeSingle();
    if (error) throw error;
    return data; // null if not found
}

export async function updateAppStatus({ appNo }) {

    const status = { applicationstatus: 'approved' }

    const { data, error } = await adminClient
        .from('business')
        .update(status)
        .eq('applicationno', appNo)
        .select('applicationno')
        .maybeSingle()

    if (error) throw error
    if (!data) {
        return { ok: false, status: 404, message: 'Something went wrong in property owner details.' };
    }
    return data;
}