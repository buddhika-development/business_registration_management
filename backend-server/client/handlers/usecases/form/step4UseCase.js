import { getBusinessByApplicationNo } from '../../repositories/businessRegistrationRepository.js';
import { getProprietorByNic, getPropertyOwnerAndPremises } from '../../repositories/proprietorRepository.js';
import { validateGNC, validateLease, validateAffidavit, validateMOH } from '../../../services/documentValidationClient.js';

function fileFrom(files, key) {
    const arr = files?.[key];
    return Array.isArray(arr) && arr.length ? arr[0] : null;
}

export default async function step4DocumentsUseCase({ body, files }) {
    const applicationNo = (body?.applicationNo || '').trim();
    if (!applicationNo) {
        return { ok: false, status: 400, message: 'applicationNo is required.' };
    }

    // 1) check business exists and get category + proprietor NIC
    const biz = await getBusinessByApplicationNo(applicationNo);
    if (!biz) return { ok: false, status: 422, message: 'Invalid applicationNo (not found).' };

    const businessCategory = (biz.businesscategory || '').toLowerCase();
    const proprietorNic = biz.proprietornic;

    // 2) get proprietor (name + address for affidavit/moh)
    const prop = proprietorNic ? await getProprietorByNic(proprietorNic) : null;
    if (!prop) return { ok: false, status: 422, message: 'Proprietor details not found for this application.' };

    const proprietorName = prop.fullname;
    const proprietorAddress = [prop.addressline1, prop.addressline2, prop.city].filter(Boolean).join(', ');
    const mohArea = prop.dsdivision || '';

    // 3) get property owner + premises (needed for lease validation)
    const prem = await getPropertyOwnerAndPremises(applicationNo);
    // If leaseAgreement file is present, these must exist:
    const needLeaseContext = !!fileFrom(files, 'leaseAgreement');

    if (needLeaseContext && (!prem || !prem.owner_name)) {
        return { ok: false, status: 422, message: 'Property owner/premises details not found for lease validation.' };
    }

    const ownerName = prem?.owner_name || '';
    const premisesAddress = [prem?.addressline1, prem?.addressline2, prem?.city].filter(Boolean).join(', ');

    // 4) input files (multer already enforced pdf mimetype)
    const fGnc = fileFrom(files, 'gnCertificates');
    const fAffidavit = fileFrom(files, 'affidavit');
    const fLease = fileFrom(files, 'leaseAgreement');
    const fMoh = fileFrom(files, 'moh');

    // 5) mandatory MOH when category=food
    if (businessCategory === 'food' && !fMoh) {
        return { ok: false, status: 422, message: 'MOH/PHI certificate is required for food category.' };
    }

    // 6) call AI validators where applicable
    // Persist locations are hints to vendor; you will actually save files yourself after this step.
    const persistBase = `s3://pending/${applicationNo.replace(/\s+/g, '')}/`;

    const out = { applicationNo };

    // GNC
    if (fGnc) {
        const r = await validateGNC({
            buffer: fGnc.buffer,
            filename: fGnc.originalname,
            name: proprietorName,
            persistLocation: `${persistBase}gnc.pdf`,
        });
        out.gnc = normalizeVendorResult('gnc', r);
    }

    // Affidavit
    if (fAffidavit) {
        const r = await validateAffidavit({
            buffer: fAffidavit.buffer,
            filename: fAffidavit.originalname,
            name: proprietorName,
            address: proprietorAddress,
            persistLocation: `${persistBase}affidavit.pdf`,
        });
        out.affidavit = normalizeVendorResult('affidavit', r);
    }

    // Lease
    if (fLease) {
        const r = await validateLease({
            buffer: fLease.buffer,
            filename: fLease.originalname,
            name: ownerName,
            address: premisesAddress,
            persistLocation: `${persistBase}lease.pdf`,
        });
        out.lease = normalizeVendorResult('lease', r);
    }

    // MOH
    if (fMoh) {
        const r = await validateMOH({
            buffer: fMoh.buffer,
            filename: fMoh.originalname,
            name: proprietorName,
            address: proprietorAddress,
            mohArea,
            persistLocation: `${persistBase}moh.pdf`,
        });
        out.moh = normalizeVendorResult('moh', r);
    }

    return {
        ok: true,
        status: 200,
        message: 'Validated.',
        data: out
    };
}

// Map vendor response to our UI shape.
// We assume vendor returns e.g. { ok:true, data:{ document_validity:true/false, reason_for_success_or_false:"...", gs_name, gs_email, persist_location:"..." } }
function normalizeVendorResult(kind, vendorRes) {
    if (!vendorRes.ok) {
        return {
            ok: false,
            reason: vendorRes.message || 'Validation failed.',
            persistLocation: null
        };
    }
    const d = vendorRes.data || {};
    const v = d.document_validity ?? d.data?.document_validity;
    const reason = d.reason_for_success_or_false ?? d.data?.reason_for_success_or_false ?? 'Processed.';
    const persist = d.persist_location ?? d.data?.persist_location ?? null;

    const base = { ok: !!v, reason, persistLocation: persist };

    if (kind === 'gnc') {
        const gsName = d.gs_name ?? d.data?.gs_name ?? null;
        const gsEmail = d.gs_email ?? d.data?.gs_email ?? null;
        return { ...base, gsName, gsEmail };
    }
    return base;
}
