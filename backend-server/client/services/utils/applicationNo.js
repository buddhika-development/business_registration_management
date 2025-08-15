import crypto from 'crypto';

export function generateApplicationNo() {

    const buf = crypto.randomBytes(4);
    const n = buf.readUInt32BE(0) % 1000000;
    const digits = String(n).padStart(7, '0');

    return `BRN - ${digits}`;

}