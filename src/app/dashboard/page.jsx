"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
import budgetsApi from "@/services/budgets.api";
import analyticsApi from "@/services/analytics.api";
import IncomeExpenseChartCard from "@/components/dashboard/IncomeExpenseChartCard";
import CategoryExpensesCard from "@/components/dashboard/CategoryExpensesCard";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import BudgetOverviewCard from "@/components/dashboard/BudgetOverviewCard";

const DashboardPage = () => {
    const { user } = useAuth();

    // Fetch active budgets for budget usage metric
    const { data: budgetsResponse } = useQuery({
        queryKey: ["budgets", { active: true, limit: 100 }],
        queryFn: async () => {
            const res = await budgetsApi.getAllBudgets({ active: true, limit: 100 });
            return res?.data || res;
        },
        staleTime: 60 * 1000,
    });

    // Fetch high-level financial summary
    const { data: summaryResponse } = useQuery({
        queryKey: ["analytics", "dashboard-summary"],
        queryFn: async () => {
            const res = await analyticsApi.getDashboardSummary();
            return res?.data || res || {};
        },
        staleTime: 30 * 1000,
    });

    const budgets = useMemo(
        () => budgetsResponse?.budgets || [],
        [budgetsResponse?.budgets]
    );
    const summary = budgetsResponse?.summary || { totalBudgeted: 0, totalSpent: 0 };
    const dashboardMetrics = summaryResponse || {};

    const totalBudgetCount = budgets?.length || 0;
    const hasExceeded = budgets?.some?.((b) => b?.isExceeded) || false;
    const budgetUsagePct = (summary?.totalBudgeted || 0) > 0
        ? Math.round(((summary?.totalSpent || 0) / summary.totalBudgeted) * 100)
        : 0;

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
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                ₹{Number(dashboardMetrics?.totalBalance || 0).toLocaleString("en-IN")}
                            </p>
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
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                ₹{Number(dashboardMetrics?.incomeThisMonth || 0).toLocaleString("en-IN")}
                            </p>
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
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                ₹{Number(dashboardMetrics?.expensesThisMonth || 0).toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                This Month
                            </p>
                        </div>
                    </div>

                    {/* Savings & Budgets */}
                    <Link
                        href="/budgets"
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/50 hover:shadow-md transition-all group cursor-pointer block"
                    >
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Budget Usage</span>
                            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                                <PiggyBank className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {budgetUsagePct}%
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                                <span className={hasExceeded ? "text-rose-500 font-semibold" : ""}>
                                    {hasExceeded
                                        ? "Over Budget Detected"
                                        : totalBudgetCount > 0
                                        ? `${totalBudgetCount} Active ${totalBudgetCount === 1 ? "Cap" : "Caps"}`
                                        : "No active caps"}
                                </span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline">
                                    Manage &rarr;
                                </span>
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Financial Graphs & Lists Grid (Below Current Cards) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card 1: Income vs Expenses Bar Chart */}
                    <IncomeExpenseChartCard />

                    {/* Card 2: Expenses by Category Donut Chart & Breakdown */}
                    <CategoryExpensesCard />

                    {/* Card 3: Recent Transactions List */}
                    <RecentTransactionsCard />

                    {/* Card 4: Budget Overview Progress */}
                    <BudgetOverviewCard />
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;
