import { ok, fail } from '../../services/utils/response.js';
import userRegisterUseCase from '../usecases/auth/userRegisterUseCase.js';

export default async function authRegisterController(req, res) {
    try {
        const result = await userRegisterUseCase(req.body || {});
        if (!result.ok) return fail(res, result.message, result.status || 400);
        return ok(res, result.data, result.message, 201);
    } catch (e) {
        const msg = e?.message || 'Server error';
        return fail(res, msg, 500);
    }
}
