"use client";

import React from "react";
import Link from "next/link";
import {
    Wallet,
    TrendingUp,
    ShieldCheck,
    PieChart,
    Sparkles,
    ArrowUpRight,
    CheckCircle2,
} from "lucide-react";

export default function AuthLayout({
    title,
    subtitle,
    children,
    footerPrompt,
    footerLinkText,
    footerLinkHref,
}) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 p-4 sm:p-6 lg:p-8">
            {/* Background ambient lighting */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900/90 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl">
                {/* Left Side: Product Showcase & Brand Hero (Visible on lg screens) */}
                <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white relative overflow-hidden">
                    {/* Background patterns */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                    {/* Brand Top Header */}
                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-200">
                                <Wallet className="w-5 h-5 text-white stroke-[2.2]" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                                Spendora
                            </span>
                        </Link>
                    </div>

                    {/* Mid Feature Badges & Visuals */}
                    <div className="relative z-10 my-8 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Smart Personal Finance</span>
                        </div>

                        <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
                            Take control of your wealth with intelligent tracking.
                        </h2>

                        {/* Interactive-looking mini stat card */}
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-300">
                                <span>Monthly Savings Target</span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                                    +18.4% <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-xl font-bold text-white">₹4,850.00</span>
                                <span className="text-xs text-slate-400">of ₹6,000.00</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full w-[80%] rounded-full" />
                            </div>
                        </div>

                        {/* Key Value Props */}
                        <div className="space-y-2.5 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Categorized transactions with instant analytics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Customizable budget caps & overspend warnings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Bank-grade encrypted token authentication</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Testimonial/Security Note */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-slate-400">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>256-bit SSL encrypted & secure data storage</span>
                    </div>
                </div>

                {/* Right Side: Auth Form Container */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden flex items-center justify-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                                <Wallet className="w-5 h-5 text-white stroke-[2.2]" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Spendora
                            </span>
                        </Link>
                    </div>

                    {/* Form Titles */}
                    <div className="mb-6 sm:mb-8 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Children Form */}
                    <div className="w-full">{children}</div>

                    {/* Footer Nav Link */}
                    {footerPrompt && footerLinkText && footerLinkHref && (
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                            {footerPrompt}{" "}
                            <Link
                                href={footerLinkHref}
                                className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 underline-offset-4 hover:underline transition-colors"
                            >
                                {footerLinkText}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
