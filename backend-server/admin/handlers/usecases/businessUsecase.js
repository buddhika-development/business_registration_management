import * as repo from "../repositories/businessRepository.js";

export const fetchBusinessById = async (id) => await repo.getBusinessById(id);
export const fetchProprietorByBusinessId = async (id) => await repo.getProprietorByBusinessId(id);
export const fetchLocationsByBusinessId = async (id) => await repo.getLocationsByBusinessId(id);
export const fetchDocumentsByBusinessId = async (id) => await repo.getDocumentsByBusinessId(id);
export const fetchDocumentsWithProvidersByApplicationNo = async (id) => {
    return await repo.getDocumentsWithProvidersByApplicationNo(id);
};
export const fetchValidBusinesses = async () => await repo.getValidBusinesses();
export const fetchPendingBusinesses = async () => await repo.getPendingBusinesses();
