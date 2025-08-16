import { adminClient } from '../../../libs/supabaseClient.js';

export async function getDocWithProvider({ applicationNo, documentId }) {
    const { data, error } = await adminClient
        .from('document_providers_with_documents')
        .select('*')
        .eq('applicationno', applicationNo)
        .eq('document_id', documentId)
        .maybeSingle();
    if (error) throw error;
    return data;
}

export async function setDocumentAuthenticity({ documentId, value }) {
    const { error } = await adminClient
        .from('documents')
        .update({ document_authenticity: value })
        .eq('id', documentId);
    if (error) throw error;
}
