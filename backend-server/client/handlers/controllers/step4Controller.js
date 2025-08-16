import { ok, fail } from '../../services/utils/response.js';
import step4DocumentsUseCase from '../usecases/form/step4UseCase.js';

export default async function step4DocumentsController(req, res) {
    try {
        const result = await step4DocumentsUseCase({ body: req.body || {}, files: req.files || {} });
        if (!result.ok) return fail(res, result.message, result.status || 400);
        return ok(res, result.data, result.message, 200);
    } catch (e) {
        const msg = e?.message || 'Server error';
        return fail(res, msg, 500);
    }
}
