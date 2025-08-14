import jwt from 'jsonwebtoken';
import { ACCESS_TTL_MINUTES } from './env.js';
import crypto from 'crypto';


const ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

export const loginAccess = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET_KEY, {
        expiresIn: `${ACCESS_TTL_MINUTES}m`,
        jwtid: crypto.randomUUID?.()
    })
};

export const verifyAccess = (token) => {
    try {
        return jwt.verify(token, ACCESS_SECRET_KEY)
    } catch (error) {
        return null;
    }
};

export const parseBearer = (h) => (h?.startswith('Bearer ') ? h.substring(7) : null);