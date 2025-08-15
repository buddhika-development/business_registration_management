import bcrypt from "bcrypt";
import { z } from "zod";
import { findCitizenByNIC } from "../../repositories/citizenRepository.js";
import { loginAccess } from "../../../services/utils/jwt.js";
import { createFamily, insertRefresh } from "../../repositories/tokenRepository.js";
import { random, hash } from "../../../services/utils/crypto.js";
import { REFRESH_TTL_MINUTES } from "../../../services/utils/env.js";

const LoginSchema = z.object({
    nic: z.string().regex(/^([0-9]{9}[VvXx]|[0-9]{12})$/, "Invalid NIC"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});


export default async function userLoginUseCase(body) {

    const { nic, password } = LoginSchema.parse(body);

    console.log("Login attempt for NIC:", nic);
    console.log("Password provided:", password);
    if (!nic || !password) {
        return {
            ok: false,
            status: 400,
            message: "NIC and Password are required"
        };
    }

    const citizen = await findCitizenByNIC(nic);
    console.log("Citizen found:", citizen ? "Yes" : "No");
    if (!citizen || !citizen.isactive) return {
        ok: false,
        status: 401,
        message: "Invalid NIC or Password"
    }

    const citizenPasswordHash = await bcrypt.compare(password, citizen.passwordhash);
    console.log("Citizen password hash:", citizenPasswordHash ? "Match" : "No Match");
    console.log("Password match:", citizenPasswordHash ? "Yes" : "No");
    if (!citizenPasswordHash) return {
        ok: false,
        status: 401,
        message: "Invalid NIC or Password"
    }

    const accessToken = loginAccess({
        sub: citizen.id,
        nic: citizen.nic,
        role: 'user'
    });
    console.log("Access token generated:", accessToken);
    if (!accessToken) {
        return {
            ok: false,
            status: 500,
            message: "Failed to generate access token"
        };
    }
    console.log("Access token generated for user ID:", citizen.id);

    const familyId = await createFamily(citizen.id);
    const rawRefresh = random(48);
    const tokenHash = hash(rawRefresh);
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MINUTES * 86400 * 1000);
    await insertRefresh({ familyId, userId: citizen.id, tokenHash, expiresAt });
    console.log("Refresh token created for family ID:", familyId);

    return {
        ok: true,
        message: "Login successful",
        status: 200,
        user: {
            id: citizen.id,
            nic: citizen.nic,
            fullName: citizen.fullname
        },
        accessToken: accessToken,
        refreshToken: {
            token: rawRefresh,
            expiresAt: expiresAt
        },
    }
}