import { fail, ok } from "../../services/utils/response.js";
import step2UseCase from "../usecases/form/step2UseCase.js"


export const step2Controller = async (req, res) => {
    try {
        const result = await step2UseCase(req.body);
        console.log("Step 3 Use Case Result:", result);
        if (!result.ok) return fail(res, result.message, result.status || 400);
        return ok(res, result.data, result.message, 200);
    } catch (e) {
        console.error("Error in step2Controller:", e);
        const msg = e?.issues?.[0]?.message || "Invalid request body";
        return fail(res, msg, 400);
    }
}