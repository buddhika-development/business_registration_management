import { ok, fail } from '../../../services/utils/response.js';
import submitDecisionUseCase from '../../usecases/gov/submitDecisionUseCase.js';
export default async function submitDecisionController(req, res) {
    const r = await submitDecisionUseCase(req.params.token, req.body);
    if (!r.ok) return fail(res, r.message, r.status || 400);
    return ok(res, r.data, r.message, 200);
}
