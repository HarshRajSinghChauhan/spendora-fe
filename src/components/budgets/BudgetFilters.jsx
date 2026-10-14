"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    X,
    Filter,
    Calendar,
    RotateCcw,
    Layers,
    Repeat,
    SlidersHorizontal,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function BudgetFilters({
    search,
    onSearchChange,
    budgetType,
    onBudgetTypeChange,
    categoryId,
    onCategoryChange,
    activeStatus,
    onActiveStatusChange,
    isRecurring,
    onIsRecurringChange,
    onResetFilters,
    hasActiveFilters,
    categories = [],
}) {
    // 300ms debounced search
    const [localSearch, setLocalSearch] = useState(search || "");
    const [prevSearch, setPrevSearch] = useState(search || "");
    const [showAdvanced, setShowAdvanced] = useState(false);

    if (search !== prevSearch) {
        setPrevSearch(search);
        setLocalSearch(search || "");
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== search) {
                onSearchChange(localSearch);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, search, onSearchChange]);

    const handleClearSearch = () => {
        setLocalSearch("");
        onSearchChange("");
    };

    const expenseCategories = categories.filter((c) => c.type === "EXPENSE" && !c.isDisabled);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
            {/* Main Row: Search, Type Segmented Control, Advanced Toggle & Reset */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[240px]">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search by category name..."
                        className="w-full text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 pl-10 pr-10 outline-none hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition-all"
                    />
                    {localSearch && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Period Cycle Filter: [ All | Monthly | Weekly ] */}
                    <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => onBudgetTypeChange("")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                !budgetType
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            All Cycles
                        </button>
                        <button
                            type="button"
                            onClick={() => onBudgetTypeChange("MONTHLY")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                budgetType === "MONTHLY"
                                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => onBudgetTypeChange("WEEKLY")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                budgetType === "WEEKLY"
                                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            Weekly
                        </button>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                            showAdvanced || hasActiveFilters
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                    </button>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={RotateCcw}
                            onClick={onResetFilters}
                            className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Collapsible Advanced Filters Section */}
            {showAdvanced && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    {/* Category Filter */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Category Scope
                        </label>
                        <select
                            value={categoryId}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:border-emerald-500"
                        >
                            <option value="">All Scopes</option>
                            <option value="OVERALL">Overall Expenses Only</option>
                            {expenseCategories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Active Status
                        </label>
                        <select
                            value={activeStatus}
                            onChange={(e) => onActiveStatusChange(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:border-emerald-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="true">Active Now</option>
                            <option value="false">Past / Inactive</option>
                        </select>
                    </div>

                    {/* Recurring Filter */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Renewal Type
                        </label>
                        <select
                            value={isRecurring}
                            onChange={(e) => onIsRecurringChange(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 px-3 py-2 outline-none focus:border-emerald-500"
                        >
                            <option value="">All Types</option>
                            <option value="true">Auto-renewing (Recurring)</option>
                            <option value="false">One-time Period</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
