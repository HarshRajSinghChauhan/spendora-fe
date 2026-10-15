"use client";

import React, { useState, useSyncExternalStore, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import analyticsApi from "@/services/analytics.api";

const emptySubscribe = () => () => {};

// Custom Pie Tooltip
const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        const data = payload?.[0]?.payload || {};
        return (
            <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-xl px-3 py-2 shadow-xl border border-slate-700/60">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: data?.color }}
                    />
                    <span className="font-bold text-slate-200">{data?.name}</span>
                </div>
                <p className="text-slate-300">
                    Amount:{" "}
                    <span className="font-bold text-white">
                        ₹{Number(data?.amount || 0).toLocaleString("en-IN")}
                    </span>
                </p>
                <p className="text-slate-400 text-[10px]">
                    Share: <span className="font-semibold text-emerald-400">{data?.percentage}%</span>
                </p>
            </div>
        );
    }
    return null;
};

export const CategoryExpensesCard = () => {
    const [period, setPeriod] = useState("this_month");
    const [activeIndex, setActiveIndex] = useState(null);
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const { data: categoryResponse, isLoading } = useQuery({
        queryKey: ["analytics", "expenses-by-category", period],
        queryFn: async () => {
            const res = await analyticsApi.getExpensesByCategory({ period });
            return res?.data || res || {};
        },
        staleTime: 60 * 1000,
    });

    const totalExpenses = Number(categoryResponse?.totalExpenses || 0);
    const categories = useMemo(() => {
        return categoryResponse?.categories || [];
    }, [categoryResponse?.categories]);

    const periodLabels = {
        this_month: "This Month",
        last_month: "Last Month",
        this_year: "This Year",
        all_time: "All Time",
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
            {/* Header with Title and Period Dropdown */}
            <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Expenses by Category
                </h2>

                {/* Period Selector */}
                <div className="relative inline-block">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e?.target?.value || "this_month")}
                        className="appearance-none bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    >
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="this_year">This Year</option>
                        <option value="all_time">All Time</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            {/* Content: Recharts Donut on Left, Legend List on Right */}
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-6">
                {!isMounted || isLoading ? (
                    <div className="w-full h-48 flex items-center justify-center">
                        <div className="animate-pulse text-sm text-slate-400">Loading categories...</div>
                    </div>
                ) : categories?.length === 0 || totalExpenses === 0 ? (
                    <div className="w-full h-48 flex flex-col items-center justify-center text-center text-sm text-slate-400 space-y-1">
                        <p className="font-medium text-slate-600 dark:text-slate-300">
                            No expenses recorded
                        </p>
                        <p className="text-xs text-slate-400">
                            for {periodLabels?.[period]?.toLowerCase() || "this period"}.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Donut Chart Visual */}
                        <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categories}
                                        dataKey="amount"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={54}
                                        outerRadius={76}
                                        paddingAngle={2}
                                        stroke="transparent"
                                        onMouseEnter={(_, index) => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        {categories?.map?.((entry, index) => (
                                            <Cell
                                                key={`cell-${entry?.categoryId || index}`}
                                                fill={entry?.color}
                                                className="transition-all duration-300 cursor-pointer"
                                                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center Cutout with Total Amount */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    ₹{totalExpenses.toLocaleString("en-IN")}
                                </span>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                    Total Expenses
                                </span>
                            </div>
                        </div>

                        {/* Category Breakdown List */}
                        <div className="flex-1 w-full space-y-2.5 max-h-56 overflow-y-auto pr-1">
                            {categories?.map?.((cat, idx) => {
                                const isHovered = activeIndex === idx;
                                return (
                                    <div
                                        key={cat?.categoryId || cat?.name || idx}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                        className={`flex items-center justify-between text-xs py-1 px-2 rounded-xl transition-all cursor-pointer ${
                                            isHovered
                                                ? "bg-slate-50 dark:bg-slate-800/80 shadow-xs"
                                                : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 truncate pr-2">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform"
                                                style={{
                                                    backgroundColor: cat?.color,
                                                    transform: isHovered ? "scale(1.2)" : "scale(1)",
                                                }}
                                            />
                                            <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                                {cat?.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {isHovered ? (
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    ₹{Number(cat?.amount || 0).toLocaleString("en-IN")}
                                                </span>
                                            ) : (
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {cat?.percentage}%
                                                </span>
                                            )}
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryExpensesCard;
