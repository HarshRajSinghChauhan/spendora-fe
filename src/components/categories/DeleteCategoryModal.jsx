"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DeleteCategoryModal({
    isOpen,
    onClose,
    category,
    onConfirm,
    isLoading = false,
}) {
    if (!isOpen || !category) return null;

    const categoryName = category.name || "this category";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col space-y-4"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-category-title"
                aria-describedby="delete-category-desc"
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
                        <h3 id="delete-category-title" className="text-lg font-bold text-slate-900 dark:text-white">
                            Delete Category
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Custom category removal
                        </p>
                    </div>
                </div>

                {/* Body Confirmation Text */}
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <p>
                        Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">&apos;{categoryName}&apos;</span>? This action cannot be undone.
                    </p>
                    <p id="delete-category-desc" className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-3 rounded-xl leading-relaxed">
                        This category may be associated with existing transactions. Deleting it will archive it from your active category list.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3">
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
                        onClick={() => onConfirm(category.id)}
                        isLoading={isLoading}
                    >
                        Delete Category
                    </Button>
                </div>
            </div>
        </div>
    );
}
