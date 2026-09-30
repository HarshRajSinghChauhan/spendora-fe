"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { X, DollarSign, Calendar, Tag, FileText, ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function TransactionModal({
    isOpen,
    onClose,
    initialData = null,
    categories = [],
    onSubmit,
    isLoading = false,
}) {
    const isEdit = Boolean(initialData?.id);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            amount: "",
            type: "EXPENSE",
            categoryId: "",
            transactionDate: new Date().toISOString().slice(0, 10),
            notes: "",
        },
    });

    const selectedType = useWatch({ control, name: "type" });
    const selectedCategoryId = useWatch({ control, name: "categoryId" });

    // Filter categories dynamically matching selected transaction type
    const filteredCategories = categories.filter(
        (cat) => cat.type === selectedType && !cat.isDisabled
    );

    // Group categories into Global and Custom
    const globalCategories = filteredCategories.filter((cat) => cat.isGlobal);
    const customCategories = filteredCategories.filter((cat) => !cat.isGlobal);

    // Populate form on edit / open
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const dateVal = initialData.transactionDate
                    ? new Date(initialData.transactionDate).toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10);

                reset({
                    title: initialData.title || "",
                    amount: initialData.amount ? String(initialData.amount) : "",
                    type: initialData.type || "EXPENSE",
                    categoryId: initialData.categoryId || initialData.category?.id || "",
                    transactionDate: dateVal,
                    notes: initialData.notes || "",
                });
            } else {
                reset({
                    title: "",
                    amount: "",
                    type: "EXPENSE",
                    categoryId: "",
                    transactionDate: new Date().toISOString().slice(0, 10),
                    notes: "",
                });
            }
        }
    }, [isOpen, initialData, reset]);

    // When type changes, verify if the currently selected category belongs to the new type
    useEffect(() => {
        if (!isOpen) return;
        if (selectedCategoryId) {
            const existsInType = filteredCategories.some((c) => c.id === selectedCategoryId);
            if (!existsInType) {
                setValue("categoryId", "");
            }
        }
    }, [selectedType, filteredCategories, selectedCategoryId, setValue, isOpen]);

    if (!isOpen) return null;

    const handleFormSubmit = async (values) => {
        const payload = {
            title: values.title?.trim() || "",
            amount: parseFloat(values.amount),
            type: values.type,
            categoryId: values.categoryId,
            transactionDate: values.transactionDate
                ? new Date(values.transactionDate).toISOString()
                : new Date().toISOString(),
            notes: values.notes?.trim() || "",
        };
        await onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {isEdit ? "Edit Transaction" : "Add New Transaction"}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isEdit
                                ? "Update your transaction details below"
                                : "Record a new income or expense transaction"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label="Close dialog"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Transaction Type Segmented Toggle */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Transaction Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setValue("type", "EXPENSE")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    selectedType === "EXPENSE"
                                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                <ArrowDownCircle className="w-4 h-4" />
                                <span>Expense</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("type", "INCOME")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    selectedType === "INCOME"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                <ArrowUpCircle className="w-4 h-4" />
                                <span>Income</span>
                            </button>
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="tx-title"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                        >
                            Title <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input
                                id="tx-title"
                                type="text"
                                placeholder="e.g., Grocery store run, Monthly salary"
                                maxLength={200}
                                {...register("title", {
                                    required: "Title is required (max 200 characters)",
                                    maxLength: {
                                        value: 200,
                                        message: "Title is required (max 200 characters)",
                                    },
                                    validate: (v) => v.trim().length > 0 || "Title is required (max 200 characters)",
                                })}
                                className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 px-4 transition-all outline-none ${
                                    errors.title
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                                }`}
                            />
                        </div>
                        {errors.title && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.title.message}</span>
                            </p>
                        )}
                    </div>

                    {/* Amount & Date (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Amount */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="tx-amount"
                                className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                            >
                                Amount <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 pointer-events-none text-slate-400">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <input
                                    id="tx-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max="999999999.99"
                                    placeholder="0.00"
                                    onKeyDown={(e) => {
                                        // Disallow negative sign, exponential 'e'
                                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                                            e.preventDefault();
                                        }
                                    }}
                                    {...register("amount", {
                                        required: "Amount must be a positive number greater than 0",
                                        validate: (val) => {
                                            const num = parseFloat(val);
                                            if (isNaN(num) || num <= 0) {
                                                return "Amount must be a positive number greater than 0";
                                            }
                                            // Max 2 decimal places check
                                            const decimals = String(val).split(".")[1];
                                            if (decimals && decimals.length > 2) {
                                                return "Amount can have a maximum of 2 decimal places";
                                            }
                                            return true;
                                        },
                                    })}
                                    className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 pl-10 pr-4 transition-all outline-none ${
                                        errors.amount
                                            ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                                    }`}
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.amount.message}</span>
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="tx-date"
                                className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                            >
                                Date <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 pointer-events-none text-slate-400">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <input
                                    id="tx-date"
                                    type="date"
                                    {...register("transactionDate", {
                                        required: "Valid transaction date is required",
                                        validate: (v) => !isNaN(new Date(v).getTime()) || "Valid transaction date is required",
                                    })}
                                    className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 pl-10 pr-4 transition-all outline-none ${
                                        errors.transactionDate
                                            ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                                    }`}
                                />
                            </div>
                            {errors.transactionDate && (
                                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.transactionDate.message}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category Select */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="tx-category"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
                        >
                            <span>
                                Category <span className="text-rose-500">*</span>
                            </span>
                            <span className="text-[11px] font-normal text-slate-400">
                                Showing {selectedType.toLowerCase()} categories
                            </span>
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3.5 pointer-events-none text-slate-400">
                                <Tag className="w-4 h-4" />
                            </div>
                            <select
                                id="tx-category"
                                {...register("categoryId", {
                                    required: "Please select a category",
                                })}
                                className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 py-2.5 pl-10 pr-8 transition-all outline-none appearance-none ${
                                    errors.categoryId
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                                }`}
                            >
                                <option value="">Select a category...</option>
                                {globalCategories.length > 0 && (
                                    <optgroup label="Default / Global Categories">
                                        {globalCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                                {customCategories.length > 0 && (
                                    <optgroup label="My Custom Categories">
                                        {customCategories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                            {/* Chevron */}
                            <div className="absolute right-3.5 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.categoryId && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.categoryId.message}</span>
                            </p>
                        )}
                        {filteredCategories.length === 0 && (
                            <p className="text-xs text-amber-500 mt-1">
                                No {selectedType.toLowerCase()} categories found. Please create one in Categories first.
                            </p>
                        )}
                    </div>

                    {/* Notes Textarea */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="tx-notes"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
                        >
                            <span>Notes (Optional)</span>
                            <span className="text-[11px] font-normal text-slate-400">Max 1000 characters</span>
                        </label>
                        <div className="relative">
                            <textarea
                                id="tx-notes"
                                rows={3}
                                placeholder="Add optional details, tags, or invoice note..."
                                maxLength={1000}
                                {...register("notes", {
                                    maxLength: {
                                        value: 1000,
                                        message: "Notes cannot exceed 1000 characters",
                                    },
                                })}
                                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 transition-all outline-none hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 resize-none"
                            />
                        </div>
                        {errors.notes && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.notes.message}</span>
                            </p>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isLoading}
                        >
                            {isEdit ? "Update Transaction" : "Save Transaction"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
