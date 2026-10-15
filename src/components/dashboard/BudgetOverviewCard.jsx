"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    ShoppingBag,
    Utensils,
    Ticket,
    Zap,
    Car,
    PiggyBank,
    ChevronRight,
} from "lucide-react";
import budgetsApi from "@/services/budgets.api";

// Helper to get category Lucide icon
const getBudgetIcon = (categoryName = "") => {
    const text = (categoryName || "").toLowerCase();
    if (text.includes("shop")) {
        return <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    if (text.includes("food") || text.includes("din") || text.includes("groc")) {
        return <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    if (text.includes("entertain") || text.includes("movie") || text.includes("ticket")) {
        return <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    if (text.includes("bill") || text.includes("util") || text.includes("electr")) {
        return <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    if (text.includes("travel") || text.includes("transport") || text.includes("fuel")) {
        return <Car className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    return <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
};

export const BudgetOverviewCard = () => {
    const { data: budgetsResponse, isLoading } = useQuery({
        queryKey: ["budgets", { active: true, limit: 3 }],
        queryFn: async () => {
            const res = await budgetsApi.getAllBudgets({ active: true, limit: 3 });
            return res?.data || res || {};
        },
        staleTime: 60 * 1000,
    });

    const budgets = useMemo(() => {
        return budgetsResponse?.budgets || [];
    }, [budgetsResponse?.budgets]);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
            {/* Header with Title and View All */}
            <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Budget Overview
                </h2>
                <Link
                    href="/budgets"
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* List of Budgets */}
            <div className="flex-1 space-y-4">
                {isLoading ? (
                    <div className="w-full h-48 flex items-center justify-center">
                        <div className="animate-pulse text-sm text-slate-400">Loading budgets...</div>
                    </div>
                ) : budgets?.length === 0 ? (
                    <div className="w-full h-48 flex flex-col items-center justify-center text-center space-y-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            No active budgets set
                        </p>
                        <Link
                            href="/budgets"
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline"
                        >
                            Set a monthly budget cap
                        </Link>
                    </div>
                ) : (
                    budgets?.map?.((budget) => {
                        const rawCatName = budget?.category?.name || "Overall";
                        const catName = rawCatName.charAt(0).toUpperCase() + rawCatName.slice(1);
                        const spent = Number(budget?.spentAmount || 0);
                        const limit = Number(budget?.limitAmount || 0);
                        const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                        const isExceeded = budget?.isExceeded || spent > limit;

                        return (
                            <Link
                                key={budget?.id}
                                href="/budgets"
                                className="block p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                            >
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    {/* Icon & Title */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shrink-0">
                                            {getBudgetIcon(rawCatName)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                                                {catName}
                                            </p>
                                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                                ₹{spent.toLocaleString("en-IN")} / ₹{limit.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Percentage & Chevron */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span
                                            className={`text-xs sm:text-sm font-bold ${
                                                isExceeded
                                                    ? "text-rose-600 dark:text-rose-400"
                                                    : "text-slate-800 dark:text-slate-200"
                                            }`}
                                        >
                                            {pct}%
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            isExceeded
                                                ? "bg-rose-500"
                                                : "bg-[#0f5132] dark:bg-emerald-500"
                                        }`}
                                    />
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BudgetOverviewCard;
