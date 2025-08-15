import z from "zod";
import { generateApplicationNo } from "../../../services/utils/applicationNo.js";
import { insertApplicationNo } from "../../repositories/businessRegistrationRepository.js";

const businessTypes = ['sole'];
const allowedCategories = ['food', 'retail', 'services', 'manufacturing'];

const step1Schema = z.object({
    businessType: z.string().transform(s => s.trim().toLowerCase()),
    businessCategory: z.string().transform(s => s.trim().toLowerCase())
});

export default async function step1UseCase(body) {
    const parsed = step1Schema.safeParse(body);
    console.log("Step 1 Use Case Input:", body);
    if (!parsed.success) {
        const fist = parsed.error.issues?.[0]?.message || "Invalid request body";
        return {
            ok: false,
            status: 400,
            message: fist,
        }
    }

    const { businessType, businessCategory } = parsed.data;

    if (!businessTypes.includes(businessType)) {
        return {
            ok: false,
            status: 400,
            message: "Invalid business type."
        }
    }
    console.log("Business type and category are valid:", businessType, businessCategory);
    if (!allowedCategories.includes(businessCategory)) {
        return {
            ok: false,
            status: 400,
            message: "Invalid business category."
        }
    }

    const appNo = generateApplicationNo();
    console.log("Generated application number:", appNo);

    const applicationNo = await insertApplicationNo(appNo);
    if (!applicationNo) {
        return {
            ok: false,
            status: 500,
            message: "Failed to insert application number."
        }
    }
    console.log("Application number inserted:", applicationNo);

    return {
        ok: true,
        status: 200,
        data: {
            applicationNo
        },
        message: "Business registration process started successfully."
    }
}