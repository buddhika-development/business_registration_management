import bcrypt from 'bcrypt';
import { z } from 'zod';
import { findCitizenByNIC, createCitizen } from '../../repositories/citizenRepository.js';

const RegisterSchema = z.object({
    nic: z.string().regex(/^([0-9]{9}[VvXx]|[0-9]{12})$/, 'NIC must be 9V/9X or 12 digits'),
    fullName: z.string().min(3, 'Full name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default async function userRegisterUseCase(body) {
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
        const first = parsed.error.issues?.[0]?.message || 'Invalid payload';
        return { ok: false, status: 400, message: first };
    }

    const { nic, fullName, password } = parsed.data;


    const existing = await findCitizenByNIC(nic);
    if (existing) {
        return { ok: false, status: 409, message: 'NIC is already registered.' };
    }


    const saltRounds = 10;
    const passwordhash = await bcrypt.hash(password, saltRounds);


    const created = await createCitizen({ nic, fullname: fullName, passwordhash });

    return {
        ok: true,
        status: 201,
        message: 'User registered successfully.',
        data: {
            id: created.id,
            nic: created.nic,
            fullName: created.fullname,
            role: created.role,
            isActive: created.isactive,
            createdAt: created.createdat,
        },
    };
}
