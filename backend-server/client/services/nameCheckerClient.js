import fetch from 'node-fetch';

const NAME_CHECK_URL = process.env.NAME_CHECK_URL || 'http://localhost:4000/api/client/name-check';

export async function checkBusinessNameAvailability(businessName) {

    const res = await fetch(NAME_CHECK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName }),
    });

    let json;

    try { json = await res.json(); } catch { json = null; }

    if (!res.ok || !json?.ok) {
        const msg = json?.errors?.message || 'Name check failed';
        return { ok: false, status: res.status || 400, message: msg };
    }

    const decision = json?.data?.decision;
    const reasons = json?.data?.reasons || [];
    return { ok: true, decision, reasons };
}
