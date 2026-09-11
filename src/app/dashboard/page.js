"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Wallet,
    LogOut,
    TrendingUp,
    TrendingDown,
    DollarSign,
    PiggyBank,
    Plus,
    User,
    Shield,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                {/* Navigation Bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                                <Wallet className="w-5 h-5 text-white stroke-[2.2]" />
                            </div>
                            <div>
                                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                                    Spendora
                                </span>
                            </div>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                                <User className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{user?.name || user?.email || "User"}</span>
                                {user?.role && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                                        {user.role}
                                    </span>
                                )}
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                isLoading={isLoggingOut}
                                onClick={handleLogout}
                                icon={LogOut}
                                className="text-xs"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">$0.00</p>
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
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">$0.00</p>
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
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">$0.00</p>
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
                </main>
            </div>
        </ProtectedRoute>
    );
}
