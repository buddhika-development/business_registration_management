import { findRefreshByHash, revokeFamily, markUsed, insertRefresh } from "../../repositories/tokenRepository.js";
import { loginAccess } from "../../../services/utils/jwt.js";
import { random, hash } from "../../../services/utils/crypto.js";
import { REFRESH_TTL_MINUTES } from "../../../services/utils/env.js";


export default async function refreshUseCase(rawRefresh) {
    const tokenHash = hash(rawRefresh);
    const rec = await findRefreshByHash(tokenHash);
    if (!rec) return {
        ok: false,
        status: 401,
        message: "Invalid refresh token"
    };

    const { familyId, userId, usedAt, familyRevokedAt, expiresAt } = rec;
    if (familyRevokedAt) return { ok: false, status: 401, message: 'Session revoked' };
    if (expiresAt < new Date()) return { ok: false, status: 401, message: 'Refresh expired' };
    if (usedAt) {
        await revokeFamily(familyId);
        return { ok: false, status: 401, message: 'Token reuse detected; sessions revoked' };
    }

    await markUsed(rec.id);

    const accessToken = loginAccess({
        sub: userId,
        role: 'user'
    });


    const rawNew = random(48);
    const newHash = hash(rawNew);
    const newExpires = new Date(Date.now() + REFRESH_TTL_MINUTES * 86400 * 1000);
    await insertRefresh({ familyId, userId, tokenHash: newHash, expiresAt: newExpires });

    return { ok: true, accessToken, rawNew, newExpires };
}