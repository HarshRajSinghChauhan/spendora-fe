"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, KeyRound, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import authApi from "@/services/auth.api";
import { authValidation } from "@/utils/validation";
import { toast } from "react-toastify";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const watchedPassword = watch("password", "");

    const onSubmit = async (data) => {
        if (!token) {
            setServerError("Reset token is missing. Please request a new password reset link.");
            return;
        }

        setServerError("");
        setIsSubmitting(true);

        try {
            await authApi.resetPassword({
                token,
                password: data.password,
            });

            toast.success("Password reset successfully! Please sign in with your new password.");
            router.push("/login?reset=success");
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Failed to reset password. The link may have expired.";
            setServerError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // If token is absent in query params, display token invalid state
    if (!token) {
        return (
            <AuthLayout
                title="Invalid Reset Link"
                subtitle="The password reset link is invalid or has expired."
                footerPrompt="Need help?"
                footerLinkText="Contact Support"
                footerLinkHref="/support"
            >
                <div className="space-y-6 text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Expired or Missing Token
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                            This password reset token has expired or is invalid. Please request a new password reset link to continue.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/forgot-password" className="w-full sm:w-auto">
                            <Button variant="primary" className="w-full">
                                Request New Link
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button variant="secondary" className="w-full">
                                Return to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Create new password"
            subtitle="Choose a strong, secure password for your account"
            footerPrompt="Remember your credentials?"
            footerLinkText="Back to Login"
            footerLinkHref="/login"
        >
            {serverError && (
                <div
                    role="alert"
                    className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-3 text-sm animate-fadeIn"
                >
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-semibold">Reset Failed</p>
                        <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{serverError}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* New Password */}
                <div>
                    <Input
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter new password"
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
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        }
                        {...register("password", authValidation.registerPassword)}
                    />

                    <PasswordStrengthMeter password={watchedPassword} />
                </div>

                {/* Confirm Password */}
                <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    icon={Lock}
                    required
                    error={errors.confirmPassword?.message}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors p-1"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                    {...register("confirmPassword", {
                        required: "Passwords do not match",
                        validate: (val) => val === watchedPassword || "Passwords do not match",
                    })}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={KeyRound}
                    className="w-full mt-3"
                >
                    Reset Password
                </Button>
            </form>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
