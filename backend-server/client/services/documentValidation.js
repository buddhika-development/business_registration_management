import fetch from 'node-fetch';
import FormData from 'form-data';

// ENV
const DOC_AI_BASE_URL = process.env.DOC_AI_BASE_URL || 'http://localhost:4000';
const DOC_AI_BEARER = process.env.DOC_AI_BEARER || ''; // from vendor doc

// helper to post form-data with vendor-specific header key "bearer"
async function postForm(urlPath, form) {
    const url = `${DOC_AI_BASE_URL}${urlPath}`;
    const headers = { bearer: DOC_AI_BEARER, ...form.getHeaders() };
    const res = await fetch(url, { method: 'POST', headers, body: form });
    let json = null;
    try { json = await res.json(); } catch (_) { }

    if (!res.ok || !json) {
        const msg = json?.errors?.message || `Upstream error ${res.status}`;
        return { ok: false, status: res.status || 500, message: msg, raw: json };
    }
    return { ok: true, status: res.status, data: json };
}

// GNC
export async function validateGNC({ buffer, filename, name, persistLocation }) {
    const form = new FormData();
    form.append('gnc', buffer, { filename, contentType: 'application/pdf' });
    form.append('name', name);
    form.append('persist_location', persistLocation);
    const r = await postForm('/api/business-registration/document-validation/gnc', form);
    return r;
}

// Lease
export async function validateLease({ buffer, filename, name, address, persistLocation }) {
    const form = new FormData();
    form.append('lease', buffer, { filename, contentType: 'application/pdf' });
    form.append('name', name);
    form.append('address', address);
    form.append('persist_location', persistLocation);
    const r = await postForm('/api/business-registration/document-validation/lease', form);
    return r;
}

// Affidavit
export async function validateAffidavit({ buffer, filename, name, address, persistLocation }) {
    const form = new FormData();
    form.append('affidavit', buffer, { filename, contentType: 'application/pdf' });
    form.append('name', name);
    form.append('address', address);
    form.append('persist_location', persistLocation);
    const r = await postForm('/api/business-registration/document-validation/affidavit', form);
    return r;
}

// MOH / PHI
export async function validateMOH({ buffer, filename, name, address, mohArea, persistLocation }) {
    const form = new FormData();
    form.append('phi', buffer, { filename, contentType: 'application/pdf' });
    form.append('name', name);
    form.append('address', address);
    form.append('moh_area', mohArea);
    form.append('persist_location', persistLocation);
    const r = await postForm('/api/business-registration/document-validation/moh', form);
    return r;
}
