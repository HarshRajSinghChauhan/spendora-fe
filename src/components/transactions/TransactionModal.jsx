"use client";

import React, { useState, useEffect } from "react";
import { X, DollarSign, Calendar, Tag, ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

const TransactionModal = ({
    isOpen,
    onClose,
    initialData = null,
    categories = [],
    onSubmit,
    isLoading = false,
}) => {
    const isEdit = Boolean(initialData?.id);

    const [type, setType] = useState("EXPENSE");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({});

    // Populate form state whenever modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const dateVal = initialData?.transactionDate
                    ? new Date(initialData.transactionDate).toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10);

                setTitle(initialData?.title || "");
                setAmount(
                    initialData?.amount !== undefined && initialData?.amount !== null
                        ? String(initialData.amount)
                        : ""
                );
                setType(initialData?.type || "EXPENSE");
                setCategoryId(initialData?.categoryId || initialData?.category?.id || "");
                setTransactionDate(dateVal);
                setNotes(initialData?.notes || "");
            } else {
                setTitle("");
                setAmount("");
                setType("EXPENSE");
                setCategoryId("");
                setTransactionDate(new Date().toISOString().slice(0, 10));
                setNotes("");
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    // Filter categories dynamically matching selected transaction type
    const filteredCategories = categories?.filter(
        (cat) => cat?.type === type && !cat?.isDisabled
    ) || [];

    // Group categories into Global and Custom
    const globalCategories = filteredCategories?.filter((cat) => cat?.isGlobal) || [];
    const customCategories = filteredCategories?.filter((cat) => !cat?.isGlobal) || [];

    const handleTypeChange = (newType) => {
        setType(newType);
        // If current category does not belong to new type, clear categoryId
        const cat = categories?.find((c) => c?.id === categoryId);
        if (cat && cat.type !== newType) {
            setCategoryId("");
        }
        if (errors.categoryId) {
            setErrors((prev) => ({ ...prev, categoryId: null }));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            newErrors.title = "Title is required (max 200 characters)";
        } else if (trimmedTitle.length > 200) {
            newErrors.title = "Title cannot exceed 200 characters";
        }

        const numAmount = parseFloat(amount);
        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            newErrors.amount = "Amount must be a positive number greater than 0";
        } else {
            const decimals = String(amount).split(".")[1];
            if (decimals && decimals.length > 2) {
                newErrors.amount = "Amount can have a maximum of 2 decimal places";
            }
        }

        if (!transactionDate || isNaN(new Date(transactionDate).getTime())) {
            newErrors.transactionDate = "Valid transaction date is required";
        }

        if (!categoryId) {
            newErrors.categoryId = "Please select a category";
        }

        if (notes && notes.length > 1000) {
            newErrors.notes = "Notes cannot exceed 1000 characters";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const payload = {
            title: trimmedTitle,
            amount: numAmount,
            type,
            categoryId,
            transactionDate: new Date(transactionDate).toISOString(),
            notes: notes.trim(),
        };

        await onSubmit?.(payload);
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
                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Transaction Type Segmented Toggle */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Transaction Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => handleTypeChange("EXPENSE")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    type === "EXPENSE"
                                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                <ArrowDownCircle className="w-4 h-4" />
                                <span>Expense</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange("INCOME")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    type === "INCOME"
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
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                                }}
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
                                <span>{errors.title}</span>
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
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                                    }}
                                    onKeyDown={(e) => {
                                        // Disallow negative sign, exponential 'e'
                                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                                            e.preventDefault();
                                        }
                                    }}
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
                                    <span>{errors.amount}</span>
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
                                    value={transactionDate}
                                    onChange={(e) => {
                                        setTransactionDate(e.target.value);
                                        if (errors.transactionDate) {
                                            setErrors((prev) => ({ ...prev, transactionDate: null }));
                                        }
                                    }}
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
                                    <span>{errors.transactionDate}</span>
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
                                Showing {type.toLowerCase()} categories
                            </span>
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3.5 pointer-events-none text-slate-400">
                                <Tag className="w-4 h-4" />
                            </div>
                            <select
                                id="tx-category"
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    if (errors.categoryId) {
                                        setErrors((prev) => ({ ...prev, categoryId: null }));
                                    }
                                }}
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
                                <span>{errors.categoryId}</span>
                            </p>
                        )}
                        {filteredCategories.length === 0 && (
                            <p className="text-xs text-amber-500 mt-1">
                                No {type.toLowerCase()} categories found. Please create one in Categories first.
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
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                    if (errors.notes) setErrors((prev) => ({ ...prev, notes: null }));
                                }}
                                className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 transition-all outline-none resize-none ${
                                    errors.notes
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                                }`}
                            />
                        </div>
                        {errors.notes && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.notes}</span>
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
};

export default TransactionModal;
