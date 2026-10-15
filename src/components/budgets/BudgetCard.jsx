"use client";

import React from "react";
import {
    PiggyBank,
    ShoppingBag,
    Utensils,
    Home,
    Car,
    Coffee,
    Briefcase,
    Zap,
    HeartPulse,
    GraduationCap,
    Film,
    Plane,
    Tag,
    Edit2,
    Trash2,
    Repeat,
    AlertCircle,
    Calendar,
    Layers,
    Clock,
} from "lucide-react";

// Helper to choose dynamic icons based on category name
const getCategoryIcon = (name) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("food") || lower.includes("grocery") || lower.includes("market")) return ShoppingBag;
    if (lower.includes("dine") || lower.includes("restaurant") || lower.includes("lunch") || lower.includes("dinner")) return Utensils;
    if (lower.includes("coffee") || lower.includes("cafe")) return Coffee;
    if (lower.includes("rent") || lower.includes("home") || lower.includes("mortgage") || lower.includes("house")) return Home;
    if (lower.includes("car") || lower.includes("fuel") || lower.includes("travel") || lower.includes("transport")) return Car;
    if (lower.includes("bill") || lower.includes("utility") || lower.includes("electricity") || lower.includes("water")) return Zap;
    if (lower.includes("health") || lower.includes("medical") || lower.includes("doctor")) return HeartPulse;
    if (lower.includes("edu") || lower.includes("school") || lower.includes("college") || lower.includes("course")) return GraduationCap;
    if (lower.includes("movie") || lower.includes("fun") || lower.includes("entertainment")) return Film;
    if (lower.includes("flight") || lower.includes("hotel") || lower.includes("vacation")) return Plane;
    if (lower.includes("work") || lower.includes("salary")) return Briefcase;
    return Tag;
};

// Format currency in INR
const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return `₹${Math.abs(num).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

// Format date range nicely
const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const BudgetCard = ({ budget, onEdit, onDelete }) => {
    const isOverall = !budget?.categoryId || !budget?.category;
    const categoryName = isOverall ? "Overall Expenses" : (budget?.category?.name || "Category");

    const limit = Number(budget?.limitAmount || 0);
    const spent = Number(budget?.spentAmount || 0);
    const remaining = Number(budget?.remainingAmount ?? (limit - spent));
    const spentPercentage = Number(budget?.spentPercentage ?? (limit > 0 ? (spent / limit) * 100 : 0));
    const isExceeded = Boolean(budget?.isExceeded || spent > limit);

    // Active status determination
    const now = new Date();
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    const isActive = startDate <= now && now <= endDate;
    const isUpcoming = startDate > now;
    const isExpired = endDate < now;

    // Progress bar color coding
    let progressBg = "bg-emerald-500 dark:bg-emerald-400";
    let badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    let statusText = "Healthy";

    if (isExceeded) {
        progressBg = "bg-rose-500 dark:bg-rose-500";
        badgeBg = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
        statusText = "Exceeded";
    } else if (spentPercentage >= 75) {
        progressBg = "bg-amber-500 dark:bg-amber-400";
        badgeBg = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
        statusText = "Near Limit";
    }

    const progressWidth = Math.min(Math.max(spentPercentage, 0), 100);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group">
            {/* Header: Icon, Category Name, Badges & Actions */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            isOverall
                                ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                        {React.createElement(isOverall ? Layers : getCategoryIcon(budget.category?.name), {
                            className: "w-5 h-5 stroke-[2.2]",
                        })}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white capitalize text-sm sm:text-base leading-tight">
                                {categoryName}
                            </h4>
                            {isOverall && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100/70 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                                    All Expenses
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {budget.budgetType}
                            </span>
                            {budget.isRecurring && (
                                <span
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                                    title="Automatically renews each period"
                                >
                                    • <Repeat className="w-3 h-3" /> Auto-renew
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit and Delete Action Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(budget)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Budget"
                        aria-label="Edit Budget"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(budget)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Budget"
                        aria-label="Delete Budget"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Spending vs Limit Display */}
            <div className="space-y-2">
                <div className="flex items-baseline justify-between text-xs sm:text-sm">
                    <div>
                        <span className="text-slate-500 dark:text-slate-400">Spent: </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(spent)}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-500 dark:text-slate-400">Cap: </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(limit)}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${progressBg}`}
                        style={{ width: `${progressWidth}%` }}
                    />
                </div>

                {/* Status & Remaining / Overspent Line */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeBg}`}
                    >
                        {isExceeded && <AlertCircle className="w-3 h-3" />}
                        <span>{spentPercentage.toFixed(1)}% ({statusText})</span>
                    </span>

                    <span
                        className={`font-semibold text-xs ${
                            isExceeded
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-slate-600 dark:text-slate-300"
                        }`}
                    >
                        {isExceeded ? (
                            `Over by ${formatCurrency(Math.abs(remaining))}`
                        ) : (
                            `${formatCurrency(remaining)} left`
                        )}
                    </span>
                </div>
            </div>

            {/* Exceeded Banner Warning */}
            {isExceeded && (
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <p className="leading-tight">
                        Exceeded limit by <span className="font-bold">{formatCurrency(Math.abs(remaining))}</span>
                    </p>
                </div>
            )}

            {/* Bottom Footer: Dates & Active Pill */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                        {formatDate(budget?.startDate)} – {formatDate(budget?.endDate)}
                    </span>
                </div>

                <div className="shrink-0 pl-2">
                    {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                        </span>
                    ) : isUpcoming ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            <Clock className="w-2.5 h-2.5" />
                            Upcoming
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            Ended
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetCard;
