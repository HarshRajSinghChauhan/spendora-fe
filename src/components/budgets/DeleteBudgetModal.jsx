"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DeleteBudgetModal({
    isOpen,
    onClose,
    budget,
    onConfirm,
    isLoading = false,
}) {
    if (!isOpen || !budget) return null;

    const isOverall = !budget.categoryId || !budget.category;
    const categoryName = isOverall ? "Overall Expenses" : (budget.category?.name || "Category");
    const formattedAmount = `₹${Number(budget.limitAmount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-4"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-budget-title"
                aria-describedby="delete-budget-desc"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label="Close dialog"
                    className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                        <h3 id="delete-budget-title" className="text-lg font-bold text-slate-900 dark:text-white">
                            Delete Budget
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Remove spending limit tracking
                        </p>
                    </div>
                </div>

                {/* Details Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Category:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{categoryName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Cap Amount:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formattedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Cycle:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{budget.budgetType}</span>
                    </div>
                </div>

                {/* Warning Text */}
                <p id="delete-budget-desc" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Are you sure you want to delete this budget? Historical transactions will not be deleted, but spending alerts and progress tracking for this cycle will cease.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={() => onConfirm(budget.id)}
                        isLoading={isLoading}
                    >
                        Delete Budget
                    </Button>
                </div>
            </div>
        </div>
    );
}
