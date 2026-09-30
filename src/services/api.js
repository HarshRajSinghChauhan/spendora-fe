import axios from "axios";
import { ENV } from "@/constants/env";

const api = axios.create({
    baseURL: ENV.API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global 401 and Errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            const isAuthRoute =
                currentPath.startsWith("/login") ||
                currentPath.startsWith("/register") ||
                currentPath.startsWith("/auth");

            // Only clean session and redirect if we are on a protected route and not on login/register
            if (!isAuthRoute) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
        }
        return Promise.reject(error);
    }
);

export default api;