import { ok, fail } from '../../../services/utils/response.js';
import getTokenInfoUseCase from '../../usecases/gov/getTokenInfoUseCase.js';
export default async function getTokenInfoController(req, res) {
    const r = await getTokenInfoUseCase(req.params.token);
    if (!r.ok) return fail(res, r.message, r.status || 400);
    return ok(res, r.data, 'Loaded', 200);
}
