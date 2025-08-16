import { ok, fail } from '../../../services/utils/response.js';
import sendMailUseCase from '../../usecases/gov/sendMailUseCase.js';


export default async function sendMailController(req, res) {
    const r = await sendMailUseCase(req.body);
    console.log("body", req.body);
    console.log("result", r);
    if (!r.ok) return fail(res, r.message, r.status || 400);
    return ok(res, r.data, r.message, 200);
}
