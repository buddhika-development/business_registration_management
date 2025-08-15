import * as repo from "../repositories/requestRepository.js";

export const fetchAllRequests = async () => await repo.getAllRequests();
export const fetchRequestById = async (id) => await repo.getRequestById(id);
export const changeRequestStatus = async (id, status) =>
    await repo.updateRequestStatus(id, status);
export const fetchRequestsByStatus = async (status) => {
    return await repo.getRequestsByStatus(status);
};
