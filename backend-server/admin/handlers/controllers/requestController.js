import { ok, fail } from "../../../client/services/utils/response.js";
import * as useCase from "../usecases/requestUseCase.js";

export const getRequests = async (req, res) => {
    try {
        const status = req.query.status?.trim();
        const filtered = status
            ? await useCase.fetchRequestsByStatus(status)
            : await useCase.fetchAllRequests();

        return ok(res, filtered, "Requests fetched successfully");
    } catch (err) {
        return fail(res, err.message, 500);
    }
};

export const getRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await useCase.fetchRequestById(id);
        if (!request) return fail(res, "Request not found", 404);
        return ok(res, request, "Request fetched successfully");
    } catch (err) {
        return fail(res, err.message, 500);
    }
};

export const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) return fail(res, "Status is required", 422);
        const updated = await useCase.changeRequestStatus(id, status);
        return ok(res, updated, "Request status updated successfully");
    } catch (err) {
        return fail(res, err.message, 500);
    }
};
