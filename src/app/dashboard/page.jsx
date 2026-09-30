"use client";

import React from "react";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PiggyBank,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white shadow-xl shadow-emerald-600/10 relative overflow-hidden">
                    <div className="relative z-10 space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Session Active</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Welcome back, {user?.name || user?.email?.split("@")[0] || "Financial Pioneer"}!
                        </h1>
                        <p className="text-sm text-emerald-100 max-w-xl">
                            You are securely logged in. Explore your financial pulse, track recent spending, and reach your savings milestones.
                        </p>
                    </div>
                </div>

                {/* Quick Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Total Balance */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Total Balance</span>
                            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹0.00</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> Net Balance Ready
                            </p>
                        </div>
                    </div>

                    {/* Income */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Total Income</span>
                            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹0.00</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                This Month
                            </p>
                        </div>
                    </div>

                    {/* Expenses */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Total Expenses</span>
                            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                                <TrendingDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹0.00</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                This Month
                            </p>
                        </div>
                    </div>

                    {/* Savings & Budgets */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Budget Usage</span>
                            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                                <PiggyBank className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">0%</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Limits Healthy
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Details Box */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
                        Active Session Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 block mb-1">User Identifier / Name</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {user?.name || "Not provided"}
                            </span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 block mb-1">Email Address</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate block">
                                {user?.email || "Unknown"}
                            </span>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 block mb-1">Role / Access Level</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {user?.role || "USER"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
