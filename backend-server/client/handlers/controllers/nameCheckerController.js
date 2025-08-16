import { ok, fail } from "../../services/utils/response.js";
import checkNameUseCase from "../usecases/nameChecker/checkNameUseCase.js";

export const checkBusinessName = async (req, res) => {
    try {
        const { businessName } = req.body;
        if (!businessName) return fail(res, "Business name is required.", 422);

        const r = await checkNameUseCase(businessName);

        if (!r.ok) return fail(res, r.message, r.status);

        return ok(res, {
            decision: r.decision,
            reasons: r.reasons
        }, r.message);
    } catch (e) {
        console.error(e);
        return fail(res, "Server error", 500);
    }
};
