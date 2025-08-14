import { adminClient } from "../../../libs/supabaseClient.js";

export async function createFamily(userId) {
    const { data, error } = await adminClient
        .from('refreshtokenfamily')
        .insert({ userid: userId })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;

}

export async function revokeFamily(familyId) {
    const { error } = await adminClient
        .from('refreshtokenfamily')
        .update({ revokedat: new Date().toISOString() })
        .eq('id', familyId);

    if (error) throw error;
}

export async function insertRefresh({ familyId, userId, tokenHash, expiresAt }) {
    const { data, error } = await adminClient
        .from('refreshtokens')
        .insert({
            familyid: familyId,
            userid: userId,
            tokenhash: tokenHash,
            expiresat: expiresAt.toISOString()
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id
}


export async function findRefreshByHash(tokenHash) {
    const { data, error } = await adminClient
        .from('refreshtokens')
        .select('id, familyid, userid, usedat, revokedat, expiresat, refreshtokenfamily!inner(revokedat)')
        .eq('tokenhash', tokenHash)
        .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
        id: data.id,
        familyId: data.familyid,
        userId: data.userid,
        usedAt: data.usedat,
        tokenRevokedAt: data.revokedat,
        familyRevokedAt: data.refreshtokenfamily.revokedat,
        expiresAt: data.expiresat ? new Date(data.expiresat) : null
    };
}

export async function markUsed(tokenId) {
    const { error } = await adminClient
        .from('refreshtokens')
        .update({ usedat: new Date().toISOString() })
        .eq('id', tokenId);

    if (error) throw error;
}