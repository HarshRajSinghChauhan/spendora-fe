"use client";

import React from "react";
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Edit2,
    Trash2,
    Calendar,
    Tag,
    FileText,
    Receipt,
    Plus,
    RefreshCw,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function TransactionTable({
    transactions = [],
    isLoading = false,
    sortBy = "transactionDate",
    sortOrder = "DESC",
    onSortChange,
    onEdit,
    onDelete,
    onAddClick,
    onClearFilters,
    hasFiltersApplied = false,
}) {
    const handleSortClick = (field) => {
        if (sortBy === field) {
            onSortChange(field, sortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            onSortChange(field, "DESC");
        }
    };

    const renderSortIcon = (field) => {
        if (sortBy !== field) {
            return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />;
        }
        return sortOrder === "ASC" ? (
            <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        ) : (
            <ArrowDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        );
    };

    // Format currency amount with commas and 2 decimals
    const formatAmount = (amount) => {
        const num = parseFloat(amount || 0);
        return new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }).format(date);
        } catch {
            return dateString;
        }
    };

    // 1. Loading Skeleton State
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between animate-pulse">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {[1, 2, 3, 4, 5].map((idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between gap-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div className="h-3 w-24 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
                                </div>
                            </div>
                            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 2. Empty State
    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 sm:p-14 text-center shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center mb-4">
                    <Receipt className="w-8 h-8 stroke-[1.8]" />
                </div>
                {hasFiltersApplied ? (
                    <div className="space-y-3 max-w-sm mx-auto">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            No matching records
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            No transactions match your search/filters.
                        </p>
                        <div className="pt-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onClearFilters}
                                icon={RefreshCw}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 max-w-sm mx-auto">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            No transactions yet
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Start taking control of your personal finances by logging your first income or expense.
                        </p>
                        <div className="pt-2">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={onAddClick}
                                icon={Plus}
                            >
                                Add Your First Transaction
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
                            <th scope="col" className="py-3.5 pl-6 pr-4">
                                <button
                                    type="button"
                                    onClick={() => handleSortClick("transactionDate")}
                                    className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                >
                                    <span>Date</span>
                                    {renderSortIcon("transactionDate")}
                                </button>
                            </th>
                            <th scope="col" className="py-3.5 px-4">
                                <button
                                    type="button"
                                    onClick={() => handleSortClick("title")}
                                    className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                >
                                    <span>Title & Notes</span>
                                    {renderSortIcon("title")}
                                </button>
                            </th>
                            <th scope="col" className="py-3.5 px-4">
                                <button
                                    type="button"
                                    onClick={() => handleSortClick("category")}
                                    className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                                >
                                    <span>Category</span>
                                    {renderSortIcon("category")}
                                </button>
                            </th>
                            <th scope="col" className="py-3.5 px-4 text-right">
                                <button
                                    type="button"
                                    onClick={() => handleSortClick("amount")}
                                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors ml-auto"
                                >
                                    <span>Amount</span>
                                    {renderSortIcon("amount")}
                                </button>
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-6 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                        {transactions.map((tx) => {
                            const isIncome = tx.type === "INCOME";
                            return (
                                <tr
                                    key={tx.id}
                                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                                >
                                    {/* Date */}
                                    <td className="py-4 pl-6 pr-4 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                                    isIncome
                                                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                                        : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                                }`}
                                            >
                                                {isIncome ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4" />
                                                )}
                                            </div>
                                            <span>{formatDate(tx.transactionDate || tx.createdAt)}</span>
                                        </div>
                                    </td>

                                    {/* Title & Notes */}
                                    <td className="py-4 px-4">
                                        <div className="max-w-md">
                                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                                                {tx.title || "Untitled Transaction"}
                                            </p>
                                            {tx.notes && (
                                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5" title={tx.notes}>
                                                    {tx.notes}
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            <Tag className="w-3 h-3 text-slate-400" />
                                            <span>{tx.category?.name || "General"}</span>
                                        </span>
                                    </td>

                                    {/* Formatted Amount (+ Green, - Red) */}
                                    <td className="py-4 px-4 whitespace-nowrap text-right font-bold text-base">
                                        <span
                                            className={
                                                isIncome
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-rose-600 dark:text-rose-400"
                                            }
                                        >
                                            {isIncome ? "+" : "-"}₹{formatAmount(tx.amount)}
                                        </span>
                                    </td>

                                    {/* Row Actions: Edit & Delete */}
                                    <td className="py-4 pl-4 pr-6 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(tx)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                                                title="Edit Transaction"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(tx)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                title="Delete Transaction"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List View (Visible on small screens) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
                {transactions.map((tx) => {
                    const isIncome = tx.type === "INCOME";
                    return (
                        <div key={tx.id} className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            isIncome
                                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                        }`}
                                    >
                                        {isIncome ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                                            {tx.title || "Untitled Transaction"}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {formatDate(tx.transactionDate || tx.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`font-bold text-base whitespace-nowrap ${
                                        isIncome
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-rose-600 dark:text-rose-400"
                                    }`}
                                >
                                    {isIncome ? "+" : "-"}₹{formatAmount(tx.amount)}
                                </div>
                            </div>

                            {tx.notes && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {tx.notes}
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    <Tag className="w-3 h-3 text-slate-400" />
                                    <span>{tx.category?.name || "General"}</span>
                                </span>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(tx)}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(tx)}
                                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
