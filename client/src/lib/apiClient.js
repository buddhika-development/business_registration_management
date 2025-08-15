import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // important: so refresh cookie is stored by the browser
    headers: { "Content-Type": "application/json" },
});
