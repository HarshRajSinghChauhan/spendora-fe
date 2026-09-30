"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { authValidation } from "@/utils/validation";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/dashboard";

    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.replace(redirectUrl);
        }
    }, [isAuthenticated, authLoading, router, redirectUrl]);

    const onSubmit = async (data) => {
        setServerError("");
        setIsSubmitting(true);

        try {
            await login(
                {
                    email: data.email.trim(),
                    password: data.password,
                },
                data.rememberMe
            );

            // Redirect user to destination
            router.push(redirectUrl);
        } catch (err) {
            setServerError(err.message || "Failed to log in. Please check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your Spendora dashboard"
            footerPrompt="Don't have an account?"
            footerLinkText="Sign up for free"
            footerLinkHref="/register"
        >
            {/* Server-level error banner */}
            {serverError && (
                <div
                    role="alert"
                    className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-3 text-sm animate-fadeIn"
                >
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold">Authentication Error</p>
                        <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{serverError}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Email input */}
                <Input
                    label="Email address"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    icon={Mail}
                    required
                    error={errors.email?.message}
                    {...register("email", authValidation.loginEmail)}
                />

                {/* Password input */}
                <div>
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        icon={Lock}
                        required
                        error={errors.password?.message}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors p-1"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        }
                        {...register("password", authValidation.loginPassword)}
                    />
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                        <input
                            type="checkbox"
                            {...register("rememberMe")}
                            className="w-4 h-4 rounded text-emerald-600 border-slate-300 dark:border-slate-700 focus:ring-emerald-500/20 dark:bg-slate-900"
                        />
                        <span>Remember me</span>
                    </label>

                    <Link
                        href="/forgot-password"
                        className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={LogIn}
                    className="w-full mt-2"
                >
                    Sign In
                </Button>
            </form>
        </AuthLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
