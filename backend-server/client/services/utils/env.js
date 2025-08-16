export const isProduction = process.env.NODE_ENV === 'production';
export const ACCESS_TTL_MINUTES = parseInt(process.env.ACCESS_TOKEN_TTL_MINUTES || '30', 10);
export const REFRESH_TTL_MINUTES = parseInt(process.env.REFRESH_TOKEN_TTL_MINUTES || '30', 10);