import { ok, fail } from "../../../client/services/utils/response.js";
import * as useCase from "../usecases/businessUsecase.js";

export const getBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await useCase.fetchBusinessById(id);

        if (!business) return fail(res, "Business not found", 404);
        return ok(res, business, "Business fetched successfully");
    } catch (err) {
        return fail(res, err.message, 500);
    }
};

export const getProprietor = async (req, res) => {
    try {
        const { id } = req.params;
        const owner = await useCase.fetchProprietorByBusinessId(id);

        if (!owner) return fail(res, "Proprietor not found", 404);
        return ok(res, owner, "Proprietor fetched successfully");
    } catch (err) {
        return fail(res, err.message, 500);
    }
};

export const getLocations = async (req, res) => {
    try {
        const { id } = req.params;
        const locations = await useCase.fetchLocationsByBusinessId(id);

        return ok(res, locations, "Locations fetched successfully");
    } catch (err) {
        return fail(res, err.message, 500);
    }
};

export const getDocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const documents = await useCase.fetchDocumentsByBusinessId(id);

        return ok(res, documents, "Documents fetched successfully");
    } catch (err) {
        return fail(res, err.message, 500);
    }
};
