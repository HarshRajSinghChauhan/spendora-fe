"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    ShoppingBag,
    Utensils,
    Zap,
    Film,
    Landmark,
    Car,
    Tag,
} from "lucide-react";
import transactionsApi from "@/services/transactions.api";

// Helper to determine styling badge based on category name
const getCategoryBadgeStyle = (categoryName = "") => {
    const lower = categoryName?.toLowerCase() || "";
    if (lower.includes("shop")) {
        return "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50";
    }
    if (lower.includes("salar") || lower.includes("income") || lower.includes("invest")) {
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50";
    }
    if (lower.includes("food") || lower.includes("din") || lower.includes("groc")) {
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50";
    }
    if (lower.includes("entertain") || lower.includes("movie") || lower.includes("subscript")) {
        return "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-900/50";
    }
    if (lower.includes("bill") || lower.includes("util") || lower.includes("electr")) {
        return "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50";
    }
    if (lower.includes("travel") || lower.includes("transport") || lower.includes("fuel")) {
        return "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-900/50";
    }
    return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
};

// Helper to choose appropriate Lucide icon or brand letter
const getTransactionIcon = (title = "", categoryName = "") => {
    const text = `${title} ${categoryName}`.toLowerCase();
    if (text.includes("amazon")) {
        return (
            <span className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-extrabold flex items-center justify-center text-xs">
                a
            </span>
        );
    }
    if (text.includes("netflix")) {
        return (
            <span className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-extrabold flex items-center justify-center text-xs">
                N
            </span>
        );
    }
    if (text.includes("swiggy") || text.includes("zomato") || text.includes("food") || text.includes("din")) {
        return (
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Utensils className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (text.includes("electr") || text.includes("bill") || text.includes("util")) {
        return (
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (text.includes("salar") || text.includes("bank") || text.includes("credit")) {
        return (
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Landmark className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (text.includes("shop")) {
        return (
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (text.includes("travel") || text.includes("transport") || text.includes("fuel") || text.includes("uber") || text.includes("ola")) {
        return (
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Car className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (text.includes("entertain") || text.includes("game")) {
        return (
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Film className="w-3.5 h-3.5" />
            </div>
        );
    }
    return (
        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
            <Tag className="w-3.5 h-3.5" />
        </div>
    );
};

export const RecentTransactionsCard = () => {
    const { data: txResponse, isLoading } = useQuery({
        queryKey: ["transactions", { limit: 5, page: 1 }],
        queryFn: async () => {
            const res = await transactionsApi.getAllTransactions({ limit: 5, page: 1 });
            return res?.data || res || {};
        },
        staleTime: 30 * 1000,
    });

    const transactions = useMemo(() => {
        return txResponse?.transactions || [];
    }, [txResponse?.transactions]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
            {/* Header with Title and View All */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Recent Transactions
                </h2>
                <Link
                    href="/transactions"
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Table / List */}
            <div className="flex-1 w-full overflow-x-auto">
                {isLoading ? (
                    <div className="w-full h-48 flex items-center justify-center">
                        <div className="animate-pulse text-sm text-slate-400">Loading transactions...</div>
                    </div>
                ) : transactions?.length === 0 ? (
                    <div className="w-full h-48 flex flex-col items-center justify-center text-center space-y-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            No recent transactions found
                        </p>
                        <Link
                            href="/transactions"
                            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline"
                        >
                            Create a transaction
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium">Description</th>
                                <th className="pb-3 font-medium text-center">Category</th>
                                <th className="pb-3 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {transactions?.map?.((tx) => {
                                const isIncome = tx?.type === "INCOME";
                                const catName = tx?.category?.name || "General";
                                const formattedCatName =
                                    catName.charAt(0).toUpperCase() + catName.slice(1);
                                const amountFormatted = Number(tx?.amount || 0).toLocaleString("en-IN");

                                return (
                                    <tr
                                        key={tx?.id}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        {/* Date */}
                                        <td className="py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                            {formatDate(tx?.transactionDate || tx?.createdAt)}
                                        </td>

                                        {/* Description + Icon */}
                                        <td className="py-3 pr-3">
                                            <div className="flex items-center gap-2.5">
                                                {getTransactionIcon(tx?.title, catName)}
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-[150px]">
                                                    {tx?.title || formattedCatName}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Category Badge */}
                                        <td className="py-3 px-2 text-center whitespace-nowrap">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${getCategoryBadgeStyle(
                                                    catName
                                                )}`}
                                            >
                                                {formattedCatName}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td
                                            className={`py-3 text-right font-bold whitespace-nowrap ${
                                                isIncome
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-rose-600 dark:text-rose-400"
                                            }`}
                                        >
                                            {isIncome ? `+₹${amountFormatted}` : `-₹${amountFormatted}`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RecentTransactionsCard;
