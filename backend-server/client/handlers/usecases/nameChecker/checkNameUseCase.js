import restrictedNames from "../../../services/utils/restrictedNames.js";
import { findBusinessByName } from "../../repositories/nameCheckerRepository.js";

const checkNameUseCase = async (businessName) => {
    const hasRestrictedWord = restrictedNames.some(word =>
        businessName.toLowerCase().includes(word.toLowerCase())
    );

    if (hasRestrictedWord) return {
        ok: false,
        status: 422,
        decision: "blocked",
        message: "Business name contains restricted terms.",
        reasons: restrictedNames.filter(word =>
            businessName.toLowerCase().includes(word.toLowerCase())
        )
    };

    const data = await findBusinessByName(businessName);
    if (data.length > 0) return {
        ok: false,
        status: 409,
        decision: "conflict",
        message: "Business name not available.",
        reasons: []
    };

    return {
        ok: true,
        status: 200,
        decision: "available",
        message: "Business name is available.",
        reasons: []
    };
};

export default checkNameUseCase;
