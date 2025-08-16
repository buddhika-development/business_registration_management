import { stripDangerous, containsProfanity } from "../../../services/utils/sanitize.js";
import { findApplicationNo, checkStatus, insertStep3, updateBusiness } from "../../repositories/businessRegistrationRepository.js";
import { NIC_REGEX, EMAIL_REGEX, SL_MOBILE_REGEX, isSLFixedLine, isISODateString, isPastOrToday, PASSPORT_REGEX, POSTAL_REGEX } from "../../../services/utils/validators.js";
import z from "zod";

const honorifics = ['mr.', 'mrs.', 'miss.', 'ms.', 'rev.'];
const genders = ['male', 'female', 'other'];

const addressSchema = z.object({
    addressLine1: z.string().min(1, 'addressLine1 is required'),
    addressLine2: z.string().optional().default(''),
    city: z.string().min(1, 'city is required'),
    postalCode: z.string().min(1, 'postalCode is required'),
    gsDivision: z.string().min(1, 'gsDivision is required'),
    dsDivision: z.string().min(1, 'dsDivision is required'),
    district: z.string().min(1, 'district is required'),
    province: z.string().min(1, 'province is required'),
});

const step3Schema = z.object({
    applicationNo: z.string().min(1, 'applicationNo is required'),
    fullName: z.string().min(1, 'fullName is required'),
    nameWithInitials: z.string().min(1, 'nameWithInitials is required'),
    maidenName: z.string().optional().default(''),
    honorific: z.string().transform(s => s.trim().toLowerCase()),
    nic: z.string().min(1, 'nic is required'),
    passportNo: z.string().optional(),
    dateOfBirth: z.string().min(1, 'dateOfBirth is required'),
    gender: z.string().transform(s => s.trim().toLowerCase()),
    residentialAddress: addressSchema,
    mobileNo: z.union([z.string(), z.number()]).optional(),
    fixedNo: z.union([z.string(), z.number()]).optional(),
    email: z.string().optional(),
});

export default async function step3UseCase(body) {

    const parsed = step3Schema.safeParse(body);
    console.log("step 3", body);
    if (!parsed.success) {
        const first = parsed.error.issues?.[0]?.message || 'Invalid request body';
        return { ok: false, status: 400, message: first };
    }

    const data = parsed.data;

    const exists = await findApplicationNo(data.applicationNo);
    if (!exists) {
        return { ok: false, status: 422, message: 'Invalid applicationNo (not found).' };
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

    const fullName = stripDangerous(data.fullName);
    const nameWithInitials = stripDangerous(data.nameWithInitials);
    const maidenName = stripDangerous(data.maidenName || '');
    const honorific = data.honorific;
    const gender = data.gender;

    if (!honorifics.includes(honorific)) {
        return { ok: false, status: 422, message: 'Invalid honorific. Allowed: Mr/Mrs/Miss/Ms/Rev.' };
    }

    if (!genders.includes(gender)) {
        return { ok: false, status: 422, message: 'Invalid gender. Allowed: male/female/other.' };
    }

    const requiresMaiden = (honorific === 'mrs' || honorific === 'ms' || gender === 'female');

    if (requiresMaiden && maidenName.trim().length === 0) {
        return { ok: false, status: 422, message: 'maidenName is required for female/Mrs/Ms.' };
    }

    if (!requiresMaiden && maidenName.trim().length > 0) {
        return { ok: false, status: 422, message: 'maidenName must be empty unless female/Mrs/Ms.' };
    }

    if (containsProfanity(fullName) || containsProfanity(nameWithInitials) || containsProfanity(maidenName)) {
        return { ok: false, status: 422, message: 'Names contain prohibited words.' };
    }

    if (!NIC_REGEX.test(data.nic)) {
        return { ok: false, status: 422, message: 'Invalid NIC format.' };
    }

    if (data.passportNo && !PASSPORT_REGEX.test(String(data.passportNo))) {
        return { ok: false, status: 422, message: 'Invalid passportNo format.' };
    }

    if (!isISODateString(data.dateOfBirth) || !isPastOrToday(data.dateOfBirth)) {
        return { ok: false, status: 422, message: 'dateOfBirth must be a valid past date (YYYY-MM-DD).' };
    }

    const a = data.residentialAddress;
    const addr1 = stripDangerous(a.addressLine1);
    const addr2 = stripDangerous(a.addressLine2 || '');
    const city = stripDangerous(a.city);
    const gs = stripDangerous(a.gsDivision);
    const ds = stripDangerous(a.dsDivision);
    const district = stripDangerous(a.district);
    const province = stripDangerous(a.province);

    if (!POSTAL_REGEX.test(a.postalCode)) {
        return { ok: false, status: 422, message: 'postalCode must contain digits only.' };
    }

    if ([addr1, addr2, city, gs, ds, district, province].some(containsProfanity)) {
        return { ok: false, status: 422, message: 'Address contains prohibited words.' };
    }

    const mobileStr = data.mobileNo != null ? String(data.mobileNo) : '';
    if (mobileStr) {
        if (!SL_MOBILE_REGEX.test(mobileStr)) {
            return { ok: false, status: 422, message: 'mobileNo must be a valid Sri Lankan mobile (10 digits, 07X prefix).' };
        }
    }

    const fixedStr = data.fixedNo != null ? String(data.fixedNo) : '';
    if (fixedStr) {
        if (!isSLFixedLine(fixedStr)) {
            return { ok: false, status: 422, message: 'fixedNo must be a valid Sri Lankan fixed line (10 digits, valid area code).' };
        }
    }

    if (data.email && !EMAIL_REGEX.test(data.email)) {
        return { ok: false, status: 422, message: 'Invalid email format.' };
    }

    const appNo = data.applicationNo
    const pNic = data.nic
    const pPassportNo = data.passportNo
    const pHonorific = data.honorific
    const pNameWithInitials = data.nameWithInitials
    const pFullName = data.fullName
    const pMaidenName = data.maidenName
    const pDateOfBirth = data.dateOfBirth
    const pGender = data.gender
    const pMobileNo = data.mobileNo
    const pFixedNo = data.fixedNo
    const pEmail = data.email
    const pAdd1 = a.addressLine1
    const pAdd2 = a.addressLine2
    const pCity = a.city
    const pPostalCode = a.postalCode
    const pGs = a.gsDivision
    const pDs = a.dsDivision
    const pDistrict = a.district
    const pProvince = a.province

    try {
        const step3i = await insertStep3({ appNo, pNic, pPassportNo, pHonorific, pNameWithInitials, pFullName, pMaidenName, pDateOfBirth, pGender, pMobileNo, pFixedNo, pEmail, pAdd1, pAdd2, pCity, pGs, pDs, pDistrict, pProvince, pPostalCode });
        const step3ii = await updateBusiness({ appNo, pNic })
        console.log("step3i", step3i);
        console.log("step3ii", step3ii);
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