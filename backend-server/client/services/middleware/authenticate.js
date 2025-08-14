import { parseBearer, verifyAccess } from "../utils/jwt.js";
import { fail } from "../utils/response.js";

export default function authenticate(req, res, next) {
    const token = parseBearer(req.headers.authorization || '');
    if (!token) {
        return fail(req, "Authenticattion Required", 401);
    }

    const decoded = verifyAccess(token);
    if (!decoded) {
        return fail(res, "Invalid or expired Token", 401);
    }

    req.user = { id: decoded.sub, nic: decoded.nic, role: decoded.role || 'user' };

    next();
}