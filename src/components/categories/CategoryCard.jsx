"use client";

import React from "react";
import {
    Globe,
    User,
    Edit2,
    Trash2,
    Lock,
    ShoppingBag,
    Utensils,
    Home,
    Car,
    Coffee,
    Briefcase,
    Zap,
    HeartPulse,
    GraduationCap,
    PiggyBank,
    Film,
    Plane,
    Tag,
} from "lucide-react";

// Helper to choose dynamic icons based on common category keywords
const getCategoryIcon = (name, type) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("food") || lower.includes("grocery") || lower.includes("market")) return ShoppingBag;
    if (lower.includes("dine") || lower.includes("restaurant") || lower.includes("lunch") || lower.includes("dinner")) return Utensils;
    if (lower.includes("coffee") || lower.includes("cafe")) return Coffee;
    if (lower.includes("rent") || lower.includes("home") || lower.includes("mortgage") || lower.includes("house")) return Home;
    if (lower.includes("car") || lower.includes("fuel") || lower.includes("travel") || lower.includes("transport")) return Car;
    if (lower.includes("salary") || lower.includes("job") || lower.includes("work") || lower.includes("bonus")) return Briefcase;
    if (lower.includes("bill") || lower.includes("utility") || lower.includes("electricity") || lower.includes("water")) return Zap;
    if (lower.includes("health") || lower.includes("medical") || lower.includes("doctor")) return HeartPulse;
    if (lower.includes("edu") || lower.includes("school") || lower.includes("college") || lower.includes("course")) return GraduationCap;
    if (lower.includes("saving") || lower.includes("invest") || lower.includes("dividend")) return PiggyBank;
    if (lower.includes("movie") || lower.includes("fun") || lower.includes("entertainment")) return Film;
    if (lower.includes("flight") || lower.includes("hotel") || lower.includes("vacation")) return Plane;
    return Tag;
};

export default function CategoryCard({
    category,
    onEdit,
    onDelete,
}) {
    const isGlobal = Boolean(category.isGlobal);
    const isIncome = category.type === "INCOME";

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group">
            {/* Top row: Icon, Name & Origin Badge */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            isIncome
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                        }`}
                    >
                        {React.createElement(getCategoryIcon(category.name, category.type), {
                            className: "w-5 h-5 stroke-[2.2]",
                        })}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white capitalize text-sm sm:text-base leading-tight">
                            {category.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {isIncome ? "Inflow Category" : "Outflow Category"}
                        </span>
                    </div>
                </div>

                {/* Origin Badge */}
                {isGlobal ? (
                    <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 select-none"
                        title="System default categories cannot be modified"
                    >
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>System Default</span>
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 select-none">
                        <User className="w-3 h-3 text-teal-500" />
                        <span>Custom</span>
                    </span>
                )}
            </div>

            {/* Bottom row: Type Badge and Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                {/* Type Badge */}
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isIncome
                            ? "bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                            : "bg-rose-100/70 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                    }`}
                >
                    {category.type}
                </span>

                {/* Actions: Edit & Delete for Custom, or Lock for Global */}
                <div>
                    {!isGlobal ? (
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => onEdit(category)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                                title="Edit Category"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(category)}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Delete Category"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="flex items-center gap-1 text-slate-400 text-xs px-2 py-1 select-none"
                            title="System default categories cannot be modified"
                        >
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[11px] text-slate-400 hidden sm:inline">Protected</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
