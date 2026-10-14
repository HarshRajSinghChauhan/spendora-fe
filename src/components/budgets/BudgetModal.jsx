"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    PiggyBank,
    Calendar,
    Repeat,
    Layers,
    AlertCircle,
    Info,
    DollarSign,
} from "lucide-react";
import Button from "@/components/ui/Button";

// Helper to format ISO date to YYYY-MM-DD for date inputs
const toInputDateFormat = (dateStr) => {
    if (!dateStr) return "";
    try {
        const d = new Date(dateStr);
        return d.toISOString().slice(0, 10);
    } catch {
        return "";
    }
};

function BudgetModalDialog({
    onClose,
    initialData = null,
    categories = [],
    onSubmit,
    isLoading = false,
}) {
    const isEdit = Boolean(initialData?.id);

    // Form states initialized directly from initialData
    const [categoryId, setCategoryId] = useState(() => initialData?.categoryId || "");
    const [limitAmount, setLimitAmount] = useState(() =>
        initialData?.limitAmount != null ? String(initialData.limitAmount) : ""
    );
    const [budgetType, setBudgetType] = useState(() => initialData?.budgetType || "MONTHLY");
    const [isRecurring, setIsRecurring] = useState(() =>
        initialData ? Boolean(initialData.isRecurring) : true
    );
    const [useCustomDates, setUseCustomDates] = useState(() =>
        Boolean(initialData?.startDate && initialData?.endDate)
    );
    const [startDate, setStartDate] = useState(() =>
        toInputDateFormat(initialData?.startDate)
    );
    const [endDate, setEndDate] = useState(() =>
        toInputDateFormat(initialData?.endDate)
    );
    const [error, setError] = useState("");

    // Filter categories to only EXPENSE types
    const expenseCategories = categories.filter((c) => c.type === "EXPENSE" && !c.isDisabled);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const amount = parseFloat(limitAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('"limitAmount" must be greater than zero');
            return;
        }

        const payload = {
            limitAmount: Number(amount.toFixed(2)),
            budgetType,
            isRecurring,
        };

        // If category is selected, pass UUID. If empty, pass null for overall budget
        if (categoryId) {
            payload.categoryId = categoryId;
        } else {
            payload.categoryId = null;
        }

        // Custom dates validation
        if (useCustomDates) {
            if (!startDate || !endDate) {
                setError('Both "startDate" and "endDate" must be provided for custom date ranges');
                return;
            }
            if (new Date(endDate) < new Date(startDate)) {
                setError('"endDate" must be greater than or equal to "startDate"');
                return;
            }
            payload.startDate = new Date(startDate).toISOString();
            payload.endDate = new Date(endDate).toISOString();
        }

        try {
            await onSubmit(payload);
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to save budget";
            setError(msg);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <PiggyBank className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                {isEdit ? "Edit Budget Limit" : "Create New Budget"}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {isEdit
                                    ? "Adjust your spending cap or rollover preferences"
                                    : "Set a spending limit for a specific category or overall expenses"}
                            </p>
                        </div>
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

                {/* Form Body (Scrollable) */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                    {/* Error Banner */}
                    {error && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                            <p className="font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* Category Selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>Category Scope</span>
                            <span className="text-[11px] text-slate-400 font-normal lowercase">
                                (Expense categories only)
                            </span>
                        </label>
                        <div className="relative">
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={isLoading}
                                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-2.5 px-3.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 cursor-pointer transition-all"
                            >
                                <option value="">🌐 All Categories (Overall Expenses)</option>
                                <optgroup label="Specific Categories">
                                    {expenseCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name} {cat.isGlobal ? "(System)" : "(Custom)"}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Leave as &quot;All Categories&quot; to track your entire monthly or weekly expense budget.
                        </p>
                    </div>

                    {/* Limit Amount Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>
                                Budget Limit Amount (₹) <span className="text-rose-500">*</span>
                            </span>
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-slate-400 font-bold text-sm pointer-events-none">
                                ₹
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                value={limitAmount}
                                onChange={(e) => setLimitAmount(e.target.value)}
                                placeholder="5000.00"
                                disabled={isLoading}
                                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-8 pr-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 font-semibold placeholder:font-normal transition-all"
                            />
                        </div>
                    </div>

                    {/* Budget Type Segmented Control */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Period Cycle
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setBudgetType("MONTHLY")}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                    budgetType === "MONTHLY"
                                        ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Monthly Budget</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setBudgetType("WEEKLY")}
                                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                    budgetType === "WEEKLY"
                                        ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Weekly Budget</span>
                            </button>
                        </div>
                    </div>

                    {/* Auto-renew / Recurring Switch */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                                <Repeat className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Auto-renew recurring budget</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                Automatically rolls over to the next week or month when this period ends, keeping your limit active.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    {/* Date Range Options */}
                    <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Date Range
                            </span>
                            <button
                                type="button"
                                onClick={() => setUseCustomDates(!useCustomDates)}
                                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                {useCustomDates ? "Switch to Auto Period" : "Specify Custom Dates"}
                            </button>
                        </div>

                        {!useCustomDates ? (
                            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                                <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                                <div className="space-y-0.5">
                                    <p className="font-semibold">Auto-calculated Period (Recommended)</p>
                                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                                        {budgetType === "MONTHLY"
                                            ? "Spans the 1st of the current month to the final calendar day."
                                            : "Spans Sunday 00:00 to Saturday 23:59 of the current week."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        required={useCustomDates}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        required={useCustomDates}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
                            {isEdit ? "Update Budget" : "Create Budget"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function BudgetModal({
    isOpen,
    onClose,
    initialData = null,
    categories = [],
    onSubmit,
    isLoading = false,
}) {
    if (!isOpen) return null;

    return (
        <BudgetModalDialog
            key={initialData?.id || "create-budget-dialog"}
            onClose={onClose}
            initialData={initialData}
            categories={categories}
            onSubmit={onSubmit}
            isLoading={isLoading}
        />
    );
}
