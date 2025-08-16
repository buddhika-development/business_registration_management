export function stripDangerous(input) {
    if (typeof input !== 'string') return input;

    // remove script/style tags and their contents
    let s = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    s = s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
    // strip all leftover tags
    s = s.replace(/<\/?[^>]+(>|$)/g, '');
    // collapse weird whitespace
    s = s.replace(/\s+/g, ' ').trim();
    return s;
}

const PROFANITY = [
    'fuck', 'shit', 'bitch', 'hoe'
];

export function containsProfanity(input) {
    if (typeof input !== 'string' || !input) return false;
    const lower = input.toLowerCase();
    return PROFANITY.some(w => lower.includes(w));
}