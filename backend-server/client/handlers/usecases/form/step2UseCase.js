import z from "zod";
import { checkStatus, findApplicationNo, insertStep2, insertStep2Owner, insertStep2Premises } from "../../repositories/businessRegistrationRepository.js";
import { checkBusinessNameAvailability } from "../../../services/nameCheckerClient.js";
import { stripDangerous, containsProfanity } from "../../../services/utils/sanitize.js";
import { NIC_REGEX, POSTAL_REGEX, DEED_REGEX, TRADE_LICENSE_REGEX, isISODateString, isFutureOrToday } from "../../../services/utils/validators.js";
import { ok } from "../../../services/utils/response.js";



const premisesTypes = ['shop'];
const ownershipTypes = ['owned', 'leased', 'consent'];

const addressSchema = z.object({
    addressLine1: z.string().min(1, 'addressLine1 is required'),
    addressLine2: z.string().optional().default(''),
    city: z.string().min(1, 'city is required'),
    postalCode: z.string().min(1, 'postalCode is required'),
    gnDivision: z.string().min(1, 'gnDivision is required'),
    dsDivision: z.string().min(1, 'dsDivision is required'),
    district: z.string().min(1, 'district is required'),
    province: z.string().min(1, 'province is required'),
})

const step2Schema = z.object({
    applicationNo: z.string().min(1, 'applicationNo is required'),
    businessName: z.string().min(1, 'businessName is required'),
    commencementDate: z.string().min(1, 'commencementDate is required'),
    businessDescription: z.string().min(1, 'businessDescription is required'),
    productServices: z.string().min(1, 'productServices is required'),
    initialCapital: z.string().min(1, 'initialCapital is required'),
    annualTurnover: z.string().min(1, 'annualTurnover is required'),
    premisesType: z.string().transform(s => s.trim().toLowerCase()),
    premisesAddress: addressSchema,
    ownershipType: z.string().transform(s => s.trim().toLowerCase()),
    propertyOwner: z.object({
        name: z.string().min(1, 'propertyOwner.name is required'),
        nic: z.string().min(1, 'propertyOwner.nic is required'),
    }),
    lease: z.object({
        validUntil: z.string().optional()
    }).optional(),
    deedNo: z.string().min(1, 'deedNo is required'),
    tradeLicenseNo: z.string().min(1, 'tradeLicenseNo is required'),
})

export default async function step2UseCase(body) {

    const parsed = step2Schema.safeParse(body);
    console.log("Step 2 Use Case Input:", body);
    if (!parsed.success) {
        const firstIssue = parsed.error.issues?.[0]?.message || "Invalid request body";
        return {
            ok: false,
            status: 400,
            message: firstIssue,
        }
    }

    const data = parsed.data;

    const exists = await findApplicationNo(data.applicationNo);
    if (!exists) {
        return {
            ok: false,
            status: 404,
            message: "Application number not found."
        };
    }

    const status = await checkStatus(data.applicationNo);
    console.log("status", status);
    if (status.applicationstatus !== 'draft') {
        return {
            ok: false,
            status: 400,
            message: "Can not edit this application"
        };
    }

    const nameCheck = await checkBusinessNameAvailability(data.businessName);
    if (!nameCheck.ok) {
        return {
            ok: false,
            status: 422,
            message: nameCheck.message
        };
    }
    if (nameCheck.decision === 'blocked') {
        return {
            ok: false,
            status: 422,
            message: 'Business name contains restricted terms.'
        };
    }

    if (nameCheck.decision === 'conflict') {
        return {
            ok: false,
            status: 409,
            message: 'Business name not available.'
        };
    }

    if (!isISODateString(data.commencementDate)) {
        return {
            ok: false,
            status: 422,
            message: 'commencementDate must be YYYY-MM-DD.'
        };
    }

    const bd = stripDangerous(data.businessDescription);
    const ps = stripDangerous(data.productServices);

    if (containsProfanity(bd) || containsProfanity(ps)) {
        return { ok: false, status: 422, message: 'Description/products contain prohibited words.' };
    }

    const initialCapitalNum = Number(data.initialCapital.toString().replace(/[, ]/g, ''));
    const annualTurnoverNum = Number(data.annualTurnover.toString().replace(/[, ]/g, ''));

    if (!Number.isFinite(initialCapitalNum) || initialCapitalNum < 0) {
        return { ok: false, status: 422, message: 'initialCapital must be a valid non-negative number.' };
    }
    if (!Number.isFinite(annualTurnoverNum) || annualTurnoverNum < 0) {
        return { ok: false, status: 422, message: 'annualTurnover must be a valid non-negative number.' };
    }

    if (!premisesTypes.includes(data.premisesType)) {
        return { ok: false, status: 422, message: 'Invalid premisesType. Allowed: shop/office/warehouse/branch/factory/other.' };
    }

    const a = data.premisesAddress;
    const a1 = stripDangerous(a.addressLine1);
    const a2 = stripDangerous(a.addressLine2 || '');
    const city = stripDangerous(a.city);
    const gn = stripDangerous(a.gnDivision);
    const ds = stripDangerous(a.dsDivision);
    const district = stripDangerous(a.district);
    const province = stripDangerous(a.province);

    if (!POSTAL_REGEX.test(a.postalCode)) {
        return { ok: false, status: 422, message: 'postalCode must contain digits only.' };
    }

    if ([a1, a2, city, gn, ds, district, province].some(containsProfanity)) {
        return { ok: false, status: 422, message: 'Address contains prohibited words.' };
    }

    if (!POSTAL_REGEX.test(a.postalCode)) {
        return { ok: false, status: 422, message: 'postalCode must contain digits only.' };
    }


    if (!ownershipTypes.includes(data.ownershipType)) {
        return { ok: false, status: 422, message: 'Invalid ownershipType. Allowed: owned/leased/consent.' };
    }

    if (!NIC_REGEX.test(data.propertyOwner.nic)) {
        return { ok: false, status: 422, message: 'propertyOwner.nic is invalid.' };
    }

    if (data.ownershipType === 'leased') {
        const vu = data?.lease?.validUntil;
        if (!vu || !isISODateString(vu) || !isFutureOrToday(vu)) {
            return { ok: false, status: 422, message: 'lease.validUntil must be a valid date not in the past for leased ownership.' };
        }
    }

    if (!DEED_REGEX.test(data.deedNo)) {
        return { ok: false, status: 422, message: 'deedNo format looks invalid (expected e.g., Colombo/15/247/1234).' };
    }

    if (!TRADE_LICENSE_REGEX.test(data.tradeLicenseNo)) {
        return { ok: false, status: 422, message: 'tradeLicenseNo format looks invalid.' };
    }

    const businessName = data.businessName
    const businessDescription = data.businessDescription
    const productServices = data.productServices
    const initialCapital = data.initialCapital
    const annualTurnover = data.annualTurnover
    const commencementDate = data.commencementDate
    const applicationNo = data.applicationNo
    const premisesType = data.premisesType
    const addressLine1 = a.addressLine1
    const addressLine2 = a.addressLine2
    const pCity = a.city
    const postalCode = a.postalCode
    const gnD = a.gnDivision
    const dsD = a.dsDivision
    const pDistrict = a.district
    const pProvince = a.province
    const ownershipType = data.ownershipType
    const propertyOwnerName = data.propertyOwner?.name
    const propertyOwnerNic = data.propertyOwner?.nic
    const leaseValidity = data.lease?.validUntil
    const deedNo = data.deedNo
    const tradeLicenseNo = data.tradeLicenseNo


    try {
        const step2i = await insertStep2({ applicationNo, businessName, businessDescription, productServices, initialCapital, annualTurnover, commencementDate })
        const step2ii = await insertStep2Owner({ propertyOwnerNic, propertyOwnerName, ownershipType, leaseValidity })
        const step2iii = await insertStep2Premises({ tradeLicenseNo, applicationNo, propertyOwnerNic, premisesType, deedNo, pCity, postalCode, gnD, dsD, pDistrict, pProvince, addressLine1, addressLine2 })
        console.log("step2", step2i);
        console.log("step2", step2ii);
        console.log("step2", step2iii);
    } catch (e) {
        const status = e.status || 500;
        const message = e.message || 'Application unsuccessful!';
        return { ok: false, status, message };
    }

    return {
        ok: true,
        status: 200,
        message: 'Validated.',
        data: { applicationNo: data.applicationNo }
    };
}