import { fail } from "../utils/response.js";

export default function authorizeRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return fail(res, "Forbidden.", 403);
        }
        next();
    };
}