import { z } from 'zod';
import { hash } from '../../../services/utils/crypto.js';
import { findTokenByHash, markTokenUsed } from '../../repositories/tokenRepository.js';
import { setDocumentAuthenticity } from '../../repositories/documentRepository.js';

const BodySchema = z.object({
    decision: z.string().transform(s => s.trim().toLowerCase())
        .refine(v => ['approve', 'reject'].includes(v), 'Invalid decision')
});

export default async function submitDecisionUseCase(rawToken, body) {
    const parsed = BodySchema.safeParse(body || {});
    if (!parsed.success) return { ok: false, status: 400, message: 'Invalid body' };
    const decision = parsed.data.decision;

    const tokenHash = hash(rawToken);
    const t = await findTokenByHash(tokenHash);
    if (!t) return { ok: false, status: 404, message: 'Invalid link' };
    if (t.used_at) return { ok: false, status: 410, message: 'Link already used' };
    if (new Date(t.expires_at).getTime() < Date.now()) return { ok: false, status: 410, message: 'Link expired' };

    const value = decision === 'approve' ? 'approved' : 'rejected';
    await setDocumentAuthenticity({ documentId: t.document_id, value });
    await markTokenUsed({ tokenId: t.id, status: value });

    return { ok: true, status: 200, message: `Document ${value}.`, data: { ApplicationNo: t.applicationno } };
}
