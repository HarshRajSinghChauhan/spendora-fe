"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import authApi from "@/services/auth.api";
import { authValidation } from "@/utils/validation";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [serverError, setServerError] = useState("");
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: { email: "" },
    });

    const onSubmit = async (data) => {
        setServerError("");
        setIsSubmitting(true);

        try {
            await authApi.forgotPassword({ email: data.email.trim() });
            setSubmittedEmail(data.email.trim());
            setIsSent(true);
            toast.success("Password reset instructions sent to your email!");
        } catch (err) {
            // Even if email is not found, security best practice often succeeds or gives clear message
            const msg = err?.response?.data?.message || err?.message || "Failed to process request.";
            setServerError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email to receive recovery instructions"
            footerPrompt="Remember your credentials?"
            footerLinkText="Back to Login"
            footerLinkHref="/login"
        >
            {isSent ? (
                <div className="space-y-6 text-center animate-fadeIn py-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Check your inbox
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                            If an account exists for <strong className="text-slate-900 dark:text-white">{submittedEmail}</strong>, we have sent a secure link to reset your password.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsSent(false)}
                            className="w-full sm:w-auto text-xs"
                        >
                            Try another email
                        </Button>
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button variant="primary" className="w-full text-xs">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {serverError && (
                        <div
                            role="alert"
                            className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-3 text-sm animate-fadeIn"
                        >
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold">Request Failed</p>
                                <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">{serverError}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            icon={Mail}
                            required
                            helperText="We will send a secure password reset link to this address."
                            error={errors.email?.message}
                            {...register("email", authValidation.registerEmail)}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isSubmitting}
                            icon={Send}
                            className="w-full mt-2"
                        >
                            Send Reset Link
                        </Button>

                        <div className="text-center pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Back to Sign In</span>
                            </Link>
                        </div>
                    </form>
                </>
            )}
        </AuthLayout>
    );
}
