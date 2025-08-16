import { hash } from '../../../services/utils/crypto.js';
import { findTokenByHash } from '../../repositories/tokenRepository.js';
import { getDocWithProvider } from '../../repositories/documentRepository.js';

export default async function getTokenInfoUseCase(rawToken) {
    const tokenHash = hash(rawToken);
    const t = await findTokenByHash(tokenHash);
    if (!t) return { ok: false, status: 404, message: 'Invalid link' };
    if (t.used_at) return { ok: false, status: 410, message: 'Link already used' };
    if (new Date(t.expires_at).getTime() < Date.now()) return { ok: false, status: 410, message: 'Link expired' };

    const doc = await getDocWithProvider({ applicationNo: t.applicationno, documentId: t.document_id });
    if (!doc) return { ok: false, status: 404, message: 'Document not found' };

    return {
        ok: true, status: 200, data: {
            applicationNo: t.applicationno,
            documentId: t.document_id,
            officerName: t.provider_name,
            providerEmail: t.provider_email,
            docName: doc.document_name,
            docLink: doc.document_link
        }
    };
}
