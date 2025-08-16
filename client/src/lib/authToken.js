export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

export const getAccessToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};
