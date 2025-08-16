import { z } from 'zod';
import { getDocWithProvider } from '../../repositories/documentRepository.js';
import { insertDocAuthToken } from '../../repositories/tokenRepository.js';
import { random, hash } from '../../../services/utils/crypto.js';
import { sendMail } from '../../../services/mailer.js';
import { govVerifyEmailHTML } from '../../../services/emailTemplates/govVerifyEmail.js';

const ReqSchema = z.object({
    applicationNo: z.string().min(1),
    documentId: z.union([z.number(), z.string()]).transform(n => Number(n))
});

export default async function sendMailUseCase(body) {
    const parsed = ReqSchema.safeParse(body);
    console.log("data", parsed.data)
    if (!parsed.success) return { ok: false, status: 400, message: 'Invalid request body' };
    const { applicationNo, documentId } = parsed.data;

    const doc = await getDocWithProvider({ applicationNo, documentId });
    if (!doc) return { ok: false, status: 404, message: 'Document not found for application' };

    const officerEmail = doc.document_provider_mail;
    const officerName = doc.document_provider_name || 'Officer';
    const providerOrg = doc.document_provider_position || '';
    const docName = doc.document_name || 'Document';
    const docLink = doc.document_link;  // must be public or signed URL

    if (!officerEmail || !docLink) return { ok: false, status: 422, message: 'Missing provider email or document link' };

    // create one-time token
    const ttlDays = parseInt(process.env.DOC_AUTH_TOKEN_TTL_DAYS || '7', 10);
    const expiresAt = new Date(Date.now() + ttlDays * 86400 * 1000);
    const raw = random(48);
    const tokenHash = hash(raw);

    await insertDocAuthToken({
        document_id: documentId,
        applicationno: applicationNo,
        provider_email: officerEmail,
        provider_name: officerName,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString()
    });

    const linkUrl = `${process.env.GOV_PORTAL_BASE_URL}/verify/${raw}`;

    const html = govVerifyEmailHTML({
        officerName, providerOrg, docName, applicationNo, linkUrl
    });

    await sendMail({
        to: officerEmail,
        subject: `Please verify ${docName} (App ${applicationNo})`,
        html
    });

    return { ok: true, status: 200, message: 'Mail sent', data: { ApplicationNo: applicationNo } };
}
