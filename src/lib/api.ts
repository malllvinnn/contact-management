import { useAuthStore } from "@/features/auth/auth.store";
import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

api.interceptors.request.use((config) => {

    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error: AxiosError) => {
    return Promise.reject(error);
})

api.interceptors.response.use((response) => {
    
    return response;
}, (error: AxiosError) => {

    if (error.status === 401) {
        const token = useAuthStore.getState().token;

        if (token) {
            useAuthStore.getState().clearAuth();
            window.location.href = "/auth/login";
        }
    }

    return Promise.reject(error);
})