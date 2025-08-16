import { fail, ok } from "../../services/utils/response.js";
import businessStatusChangeUseCase from "../usecases/businessOperations/businessStatusChangeUseCase.js";

export const businessStatusChangeController = async (req, res) => {
    try {
        const result = await businessStatusChangeUseCase(req.body || {});
        console.log("Step 1 Use Case Result:", result);
        if (!result.ok) return fail(res, result.message, result.status || 400);
        return ok(res, result.data, result.message, 200);
    } catch (e) {
        console.error("Error in step1Controller:", e);
        const msg = e?.issues?.[0]?.message || "Invalid request body";
        return fail(res, msg, 400);
    }

}