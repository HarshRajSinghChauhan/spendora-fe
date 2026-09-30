"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { useAuth } from "@/context/AuthContext";
import { authValidation } from "@/utils/validation";

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const watchedPassword = watch("password", "");

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    const onSubmit = async (data) => {
        setServerError("");
        setIsSubmitting(true);

        try {
            const result = await registerUser({
                name: data.name.trim(),
                email: data.email.trim(),
                password: data.password,
            });

            // If auto-logged in, navigate to dashboard; otherwise redirect to login
            if (result?.autoLoggedIn || result?.token) {
                router.push("/dashboard");
            } else {
                router.push("/login?registered=true");
            }
        } catch (err) {
            setServerError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Start tracking expenses, setting budgets, and growing your savings today"
            footerPrompt="Already have an account?"
            footerLinkText="Log in"
            footerLinkHref="/login"
        >
            {/* Server Error Alert */}
            {serverError && (
                <div
                    role="alert"
                    className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-3 text-sm animate-fadeIn"
                >
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold">Registration Issue</p>
                        <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{serverError}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Full Name / Username */}
                <Input
                    label="Full Name / Username"
                    type="text"
                    name="name"
                    placeholder="e.g. John Doe"
                    icon={User}
                    required
                    error={errors.name?.message}
                    {...register("name", authValidation.name)}
                />

                {/* Email address */}
                <Input
                    label="Email address"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    icon={Mail}
                    required
                    error={errors.email?.message}
                    {...register("email", authValidation.registerEmail)}
                />

                {/* Password with inline toggle and strength meter */}
                <div>
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
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
                        {...register("password", authValidation.registerPassword)}
                    />

                    {/* Interactive password strength indicator */}
                    <PasswordStrengthMeter password={watchedPassword} />
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={UserPlus}
                    className="w-full mt-3"
                >
                    Create Account
                </Button>

                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1">
                    By signing up, you agree to Spendora&apos;s Terms of Service and Privacy Policy.
                </p>
            </form>
        </AuthLayout>
    );
}
