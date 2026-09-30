"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import authApi from "@/services/auth.api";

const AuthContext = createContext({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    updateUser: () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Initialize Auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem("access_token");
                const storedUser = localStorage.getItem("user");

                if (storedToken) {
                    setToken(storedToken);
                    if (storedUser) {
                        try {
                            setUser(JSON.parse(storedUser));
                        } catch {
                            setUser(null);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to restore auth session:", err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Extract token and user safely from varied API response formats
    const parseAuthResponse = (response) => {
        const payload = response?.data || response;
        const accessToken =
            payload?.accessToken ||
            payload?.token ||
            payload?.tokens?.accessToken ||
            response?.accessToken ||
            response?.token;

        const userData =
            payload?.user ||
            response?.user ||
            null;

        return { accessToken, userData, message: response?.message || payload?.message };
    };

    const login = useCallback(
        async (credentials, rememberMe = false) => {
            try {
                const response = await authApi.login(credentials);
                const { accessToken, userData, message } = parseAuthResponse(response);

                if (accessToken) {
                    localStorage.setItem("access_token", accessToken);
                    setToken(accessToken);
                }

                if (userData) {
                    localStorage.setItem("user", JSON.stringify(userData));
                    setUser(userData);
                } else {
                    // Fallback basic user info if backend returns only email
                    const fallbackUser = { email: credentials.email };
                    localStorage.setItem("user", JSON.stringify(fallbackUser));
                    setUser(fallbackUser);
                }

                if (rememberMe) {
                    localStorage.setItem("remember_me", "true");
                } else {
                    localStorage.removeItem("remember_me");
                }

                toast.success(message || "Welcome back to Spendora!");
                return { success: true, user: userData || { email: credentials.email }, token: accessToken };
            } catch (error) {
                const errorMessage =
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Invalid email or password. Please try again.";
                
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        []
    );

    const register = useCallback(
        async (data) => {
            try {
                const response = await authApi.register(data);
                const { accessToken, userData, message } = parseAuthResponse(response);

                if (accessToken) {
                    localStorage.setItem("access_token", accessToken);
                    setToken(accessToken);
                }

                if (userData) {
                    localStorage.setItem("user", JSON.stringify(userData));
                    setUser(userData);
                }

                toast.success(message || "Account created successfully! Welcome to Spendora.");
                return { success: true, user: userData, token: accessToken, autoLoggedIn: !!accessToken };
            } catch (error) {
                const errorMessage =
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Registration failed. Please check your details and try again.";
                
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            // Ignore server logout errors during client cleanup
            console.warn("Server logout notification skipped or failed:", err?.message);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
            toast.info("Logged out successfully");
            router.push("/login");
        }
    }, [router]);

    const updateUser = useCallback((newUserData) => {
        setUser((prev) => {
            const updated = { ...prev, ...newUserData };
            localStorage.setItem("user", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
