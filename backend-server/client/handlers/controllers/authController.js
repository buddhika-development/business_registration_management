import { ok, fail } from "../../services/utils/response.js";
import userLoginUseCase from "../usecases/auth/userLoginUseCase.js";
import refreshUseCase from "../usecases/auth/refreshUseCase.js";
import logoutUseCase from "../usecases/auth/logoutUseCase.js";

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30
}

export const userLogin = async (req, res) => {
    try {
        console.log("Login request body:", req.body);
        const r = await userLoginUseCase(req.body);
        if (!r.ok) return fail(res, r.message, r.status);

        res.cookie('refreshToken', r.refreshToken.token, cookieOptions);

        return ok(res, {
            user: r.user,
            accessToken: r.accessToken,
            refreshToken: {
                token: r.refreshToken.token,
                expiresAt: r.refreshToken.expiresAt
            }
        }, "Login successful");
    } catch (e) {
        const msg = e?.issues?.[0]?.message || "Invalid request body";
        return fail(res, msg, 400);
    }
}

export const refresh = async (req, res) => {
    const raw = req.cookies?.refreshToken;
    if (!raw) return fail(res, 'No refresh token.', 401);

    const r = await refreshUseCase(raw);
    if (!r.ok) return fail(res, r.message, r.status || 401);

    res.cookie('refreshToken', r.rawNew, cookieOptions);
    return ok(res, {
        AccessToken: r.accessToken,
        ExpiresInMin: parseInt(process.env.ACCESS_TOKEN_TTL_MIN || '10', 10)
    }, 'Token refreshed.');
};

export const logout = async (req, res) => {
    await logoutUseCase();
    res.clearCookie('refreshToken', { path: '/' });
    return ok(res, {}, 'Logged out.', 200);
};