import crypto from 'crypto';

export const random = (bytes = 48) => {
    return crypto.randomBytes(bytes).toString('hex');
}

export const hash = (s) => {
    return crypto.createHash('sha256').update(s).digest('hex');
}