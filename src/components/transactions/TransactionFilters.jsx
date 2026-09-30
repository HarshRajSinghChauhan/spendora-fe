"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    X,
    Filter,
    Calendar,
    Tag,
    RotateCcw,
    ChevronDown,
    SlidersHorizontal,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function TransactionFilters({
    search,
    onSearchChange,
    type,
    onTypeChange,
    category,
    onCategoryChange,
    periodPreset,
    onPeriodPresetChange,
    fromDate,
    toDate,
    onDateRangeChange,
    minAmount,
    maxAmount,
    onAmountRangeChange,
    onResetFilters,
    hasActiveFilters,
    categories = [],
}) {
    // Local search value for 300ms debounce
    const [localSearch, setLocalSearch] = useState(search || "");
    const [prevSearch, setPrevSearch] = useState(search || "");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    if (search !== prevSearch) {
        setPrevSearch(search);
        setLocalSearch(search || "");
    }

    // 300ms debounce on search
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

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
            {/* Top Toolbar Row: Search, Type Toggle, Period & Actions */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                {/* Search Input (Debounced 300ms) */}
                <div className="relative flex-1 min-w-[240px]">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search by title or notes..."
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

                {/* Filter Controls Group */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Type Filter Toggle: [ All | Income | Expense ] */}
                    <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => onTypeChange("")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                !type
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => onTypeChange("INCOME")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                type === "INCOME"
                                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => onTypeChange("EXPENSE")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                type === "EXPENSE"
                                    ? "bg-rose-600 text-white shadow-sm shadow-rose-600/20"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            Expense
                        </button>
                    </div>

                    {/* Period Preset Dropdown */}
                    <div className="relative">
                        <select
                            value={periodPreset}
                            onChange={(e) => onPeriodPresetChange(e.target.value)}
                            className="text-xs font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 py-2.5 pl-3.5 pr-8 appearance-none outline-none hover:border-slate-300 focus:border-emerald-500 transition-all cursor-pointer"
                        >
                            <option value="all">All Time</option>
                            <option value="daily">Today (Daily)</option>
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                            <option value="yearly">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Advanced Filters Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setShowAdvancedFilters((prev) => !prev)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                            showAdvancedFilters || Boolean(category || minAmount || maxAmount || (periodPreset === "custom" && (fromDate || toDate)))
                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                                : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filters</span>
                    </button>

                    {/* Reset Filters CTA */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 transition-all"
                            title="Reset all filters to defaults"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Collapsible Advanced Filters Bar (Category, Custom Dates, Amount Range) */}
            {(showAdvancedFilters || periodPreset === "custom") && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200">
                    {/* Category Select Dropdown */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => onCategoryChange(e.target.value)}
                                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 py-2 pl-3 pr-8 appearance-none outline-none focus:border-emerald-500"
                            >
                                <option value="">All Categories</option>
                                {categories
                                    .filter((c) => !type || c.type === type)
                                    .map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name} ({cat.type})
                                        </option>
                                    ))}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    {/* Custom Date Range: From */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={fromDate || ""}
                            onChange={(e) => onDateRangeChange(e.target.value, toDate)}
                            className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 py-1.5 px-3 outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Custom Date Range: To */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={toDate || ""}
                            onChange={(e) => onDateRangeChange(fromDate, e.target.value)}
                            className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 py-1.5 px-3 outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* Amount Range (Min - Max) */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Amount Range (₹)
                        </label>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minAmount || ""}
                                onChange={(e) => onAmountRangeChange(e.target.value, maxAmount)}
                                className="w-1/2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 py-1.5 px-2.5 outline-none focus:border-emerald-500"
                            />
                            <span className="text-slate-400 text-xs">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxAmount || ""}
                                onChange={(e) => onAmountRangeChange(minAmount, e.target.value)}
                                className="w-1/2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 py-1.5 px-2.5 outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
