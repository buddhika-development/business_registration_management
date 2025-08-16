import { api } from '@/lib/apiClient';
import { getAccessToken } from '@/lib/authToken';

// build Authorization header per request
function authHeaders() {
    const t = getAccessToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
}

// Step 1: Business details
export async function postStep1(payload) {
    return api.post(
        '/api/client/step1-business',
        payload,
        { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
    );
}

// Step 2: Business Details
export async function postStep2(payload) {
    return api.post(
        '/api/client/step2-BusinessDetails',
        payload,
        { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
    );
}

// Step 3: Proprietor details
export async function postStep3(payload) {
    return api.post(
        '/api/client/step3-contacts',
        payload,
        { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
    );
}

// Step 4: Documents (multipart)
export async function postStep4({ applicationNo, files }) {
    const fd = new FormData();
    fd.append('applicationNo', applicationNo);

    // Append files only if present
    if (files?.gnCertificates) fd.append('gnCertificates', files.gnCertificates);
    if (files?.affidavit) fd.append('affidavit', files.affidavit);
    if (files?.ownerNicCopy) fd.append('ownerNicCopy', files.ownerNicCopy);
    if (files?.propertyNicCopy) fd.append('propertyNicCopy', files.propertyNicCopy);
    if (files?.varipanamAssessmentNotice) fd.append('varipanamAssessmentNotice', files.varipanamAssessmentNotice);
    if (files?.leaseAgreement) fd.append('leaseAgreement', files.leaseAgreement);
    if (files?.tradeLicenseDoc) fd.append('tradeLicenseDoc', files.tradeLicenseDoc);
    if (files?.moh) fd.append('moh', files.moh);

    return api.post(
        '/api/client/step4-businessDetails',
        fd,
        {
            headers: {
                ...authHeaders(),
                // DO NOT set Content-Type manually; let the browser add boundary
            }
        }
    );
}
