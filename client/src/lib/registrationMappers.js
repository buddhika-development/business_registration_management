// ---------- tiny helper ----------
const pick = (...candidates) => {
    for (const c of candidates) {
        if (c !== undefined && c !== null && c !== "") return c;
    }
    return "";
};

const toDateOnly = (d) => {
    if (!d) return "";
    const iso = new Date(d);
    if (isNaN(iso.getTime())) return "";
    return iso.toISOString().slice(0, 10);
};

// ---------- STEP 1 ----------
export function mapStep1(categoryState) {
    // accept both {type, category} and {businessType, businessCategory}
    const businessType = pick(categoryState?.businessType, categoryState?.type);
    const businessCategory = pick(categoryState?.businessCategory, categoryState?.category);
    return { businessType, businessCategory };
}

// ---------- STEP 2 ----------
export function mapStep2({ applicationNo, business, premisesType }) {
    const b = business || {};
    const pa = b.PremisesAddress || b.premisesAddress || {};
    const owner = b.PropertyOwner || b.propertyOwner || {};
    const lease = b.Lease || b.lease || {};

    const appNo = pick(applicationNo, b.ApplicationNo, b.applicationNo);
    const commencement = pick(b.CommencementDate, b.commencementDate);

    return {
        applicationNo: appNo,

        businessName: pick(b.BusinessName, b.businessName),
        commencementDate: toDateOnly(commencement),

        businessDescription: pick(b.BusinessDescription, b.businessDescription),
        productServices: pick(b.ProductServices, b.productServices),

        initialCapital: pick(b.InitialCapital, b.initialCapital),
        annualTurnover: pick(b.AnnualTurnover, b.annualTurnover),

        premisesType: pick(premisesType, b.PremisesType, b.premisesType),

        premisesAddress: {
            addressLine1: pick(pa.AddressLine1, pa.addressLine1),
            addressLine2: pick(pa.AddressLine2, pa.addressLine2),
            city: pick(pa.City, pa.city),
            postalCode: pick(pa.PostalCode, pa.postalCode),
            gnDivision: pick(pa.GnDivision, pa.gnDivision),
            dsDivision: pick(pa.DsDivision, pa.dsDivision),
            district: pick(pa.District, pa.district),
            province: pick(pa.Province, pa.province),
        },

        ownershipType: pick(b.OwnershipType, b.ownershipType), // 'owned' | 'leased' | 'consent'

        propertyOwner: {
            name: pick(owner.Name, owner.name),
            nic: pick(owner.NIC, owner.Nic, owner.nic),
        },

        lease: {
            validUntil: pick(lease.ValidUntil, lease.validUntil),
        },

        deedNo: pick(b.DeedNo, b.deedNo),
        tradeLicenseNo: pick(b.TradeLicenseNo, b.tradeLicenseNo),
    };
}

// ---------- STEP 3 ----------
export function mapStep3(appNo, values) {
    const v = values || {};
    const addr = v.ResidentialAddress || v.residentialAddress || {};
    const app = pick(appNo, v.ApplicationNo, v.applicationNo);

    return {
        applicationNo: app,

        fullName: pick(v.FullName, v.fullName),
        nameWithInitials: pick(v.NameWithInitials, v.nameWithInitials),
        maidenName: pick(v.MaidenName, v.maidenName),
        honorific: pick(v.Honorific, v.honorific),

        nic: pick(v.NIC, v.Nic, v.nic),
        passportNo: pick(v.PassportNo, v.passportNo),
        dateOfBirth: pick(v.DateOfBirth, v.dateOfBirth),
        gender: pick(v.Gender, v.gender), // 'male' | 'female' | 'other'

        residentialAddress: {
            addressLine1: pick(addr.AddressLine1, addr.addressLine1),
            addressLine2: pick(addr.AddressLine2, addr.addressLine2),
            city: pick(addr.City, addr.city),
            postalCode: pick(addr.PostalCode, addr.postalCode),
            gsDivision: pick(addr.GsDivision, addr.gsDivision),
            dsDivision: pick(addr.DsDivision, addr.dsDivision),
            district: pick(addr.District, addr.district),
            province: pick(addr.Province, addr.province),
        },

        mobileNo: pick(v.MobileNo, v.mobileNo),
        fixedNo: pick(v.FixedNo, v.fixedNo),
        email: pick(v.Email, v.email),
    };
}

// ---------- STEP 4 ----------
export function mapStep4Files(docState) {
    return {
        gnCertificates: docState?.gnCertificates || null,
        affidavit: docState?.affidavit || null,
        ownerNicCopy: docState?.ownerNicCopy || null,
        propertyNicCopy: docState?.propertyNicCopy || null,
        varipanamAssessmentNotice: docState?.varipanamAssessmentNotice || null,
        leaseAgreement: docState?.leaseAgreement || null,
        tradeLicenseDoc: docState?.tradeLicenseDoc || null,
        moh: docState?.moh || null,
    };
}