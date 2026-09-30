"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DeleteTransactionModal({
    isOpen,
    onClose,
    transaction,
    onConfirm,
    isLoading = false,
}) {
    if (!isOpen || !transaction) return null;

    const transactionTitle = transaction.title || "this transaction";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-5"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
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

                {/* Warning Icon & Heading */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                        <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
                            Delete Transaction
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Permanent action
                        </p>
                    </div>
                </div>

                {/* Explicit confirmation message required by Section 6.1 */}
                <p id="delete-dialog-description" className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">&apos;{transactionTitle}&apos;</span>? This action cannot be undone.
                </p>

                {/* Transaction snippet pill */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-slate-200">
                            {transaction.category?.name || "Uncategorized"}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                            {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : "Recent"}
                        </p>
                    </div>
                    <div className={`font-bold text-sm ${transaction.type === "INCOME" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {transaction.type === "INCOME" ? "+" : "-"}₹{parseFloat(transaction.amount || 0).toFixed(2)}
                    </div>
                </div>

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
                        onClick={() => onConfirm(transaction.id)}
                        isLoading={isLoading}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
