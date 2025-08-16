export const NIC_REGEX = /^([0-9]{9}[VvXx]|[0-9]{12})$/;
export const POSTAL_REGEX = /^[0-9]{3,10}$/;
export const DEED_REGEX = /^([A-Za-z]{2,}|[A-Za-z]+(?:[ -][A-Za-z]+)*|[A-Za-z]{2,}\/[A-Za-z0-9]+)\/[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9]+$/;
export const TRADE_LICENSE_REGEX = /^[A-Za-z0-9\/\-]{4,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SL_MOBILE_REGEX = /^(070|071|072|074|075|076|077|078)\d{7}$/;
export const PASSPORT_REGEX = /^([A-Za-z]{1,2}\d{6,8}|[A-Za-z0-9]{8,12})$/;

const FIXED_AREAS = new Set([
    '011', '021', '023', '024', '025', '026', '027', '031', '033', '034', '035', '036', '037', '038',
    '041', '045', '047', '051', '052', '054', '055', '057', '063', '065', '066', '067', '081', '091'
]);
export function isSLFixedLine(num) {
    return typeof num === 'string'
        && /^\d{10}$/.test(num)
        && num.startsWith('0')
        && FIXED_AREAS.has(num.slice(0, 3));
}

export function isISODateString(s) {
    if (typeof s !== 'string') return false;
    const d = new Date(s);
    return !Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(s);
}

export function isFutureOrToday(dateStr) {
    const d = new Date(dateStr);
    const today = new Date();
    // compare by date only
    d.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    return d.getTime() >= today.getTime();
}

export function isPastOrToday(dateStr) {
    const d = new Date(dateStr);
    const today = new Date();
    d.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    return d.getTime() <= today.getTime();
}