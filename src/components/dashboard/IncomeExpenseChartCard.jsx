"use client";

import React, { useRef, useEffect, useSyncExternalStore, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import analyticsApi from "@/services/analytics.api";

const emptySubscribe = () => () => {};

// Custom Recharts Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        const income = payload?.[0]?.value || 0;
        const expenses = payload?.[1]?.value || 0;
        const net = income - expenses;

        return (
            <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-xs rounded-2xl p-3 shadow-xl border border-slate-700/60 min-w-[150px] z-50">
                <p className="font-bold text-slate-200 mb-2 pb-1 border-b border-slate-700/60">
                    {label}
                </p>
                <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-[#0f5132] dark:bg-[#10b981]" />
                            Income:
                        </span>
                        <span className="font-semibold text-[#86efac] dark:text-[#34d399]">
                            ₹{Number(income).toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-[#86efac] dark:bg-[#34d399]" />
                            Expenses:
                        </span>
                        <span className="font-semibold text-rose-300">
                            ₹{Number(expenses).toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1.5 mt-1 border-t border-slate-700/60">
                        <span className="text-slate-400">Net:</span>
                        <span
                            className={`font-bold ${
                                net >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                        >
                            {net >= 0 ? `+₹${net.toLocaleString("en-IN")}` : `-₹${Math.abs(net).toLocaleString("en-IN")}`}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const IncomeExpenseChartCard = () => {
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const scrollContainerRef = useRef(null);

    const { data: chartResponse, isLoading } = useQuery({
        queryKey: ["analytics", "income-vs-expenses", "fiscal_year"],
        queryFn: async () => {
            const res = await analyticsApi.getIncomeVsExpenses({ range: "fiscal_year" });
            return res?.data || res || [];
        },
        staleTime: 60 * 1000,
    });

    const monthsData = useMemo(() => {
        if (Array.isArray(chartResponse)) return chartResponse;
        if (Array.isArray(chartResponse?.data)) return chartResponse?.data;
        return [];
    }, [chartResponse]);

    // Dynamic upper limit for Y-axis
    const maxVal = useMemo(() => {
        let max = 40000;
        monthsData?.forEach?.((item) => {
            if ((item?.income || 0) > max) max = item?.income;
            if ((item?.expenses || 0) > max) max = item?.expenses;
        });
        return Math.ceil(max / 10000) * 10000;
    }, [monthsData]);

    // Calculate Y-axis ticks for guaranteed pinned display
    const yTicks = useMemo(() => {
        const step = maxVal / 4;
        return [
            { label: `${maxVal / 1000}K`, value: maxVal },
            { label: `${(step * 3) / 1000}K`, value: step * 3 },
            { label: `${(step * 2) / 1000}K`, value: step * 2 },
            { label: `${step / 1000}K`, value: step },
            { label: "0", value: 0 },
        ];
    }, [maxVal]);

    // Auto-scroll on mobile to the first month with active data (e.g. September/October)
    useEffect(() => {
        if (!scrollContainerRef?.current || !monthsData?.length) return;

        const firstActiveIndex = monthsData?.findIndex?.(
            (m) => (m?.income || 0) > 0 || (m?.expenses || 0) > 0
        );

        if (firstActiveIndex > 0) {
            const timer = setTimeout(() => {
                const container = scrollContainerRef?.current;
                if (container) {
                    const totalWidth = container.scrollWidth || 560;
                    const monthWidth = totalWidth / (monthsData?.length || 12);
                    // Scroll so active month appears with ~half a month context on the left
                    const scrollTarget = Math.max(0, (firstActiveIndex - 0.5) * monthWidth);
                    container.scrollTo({
                        left: scrollTarget,
                        behavior: "smooth",
                    });
                }
            }, 250);

            return () => clearTimeout(timer);
        }
    }, [monthsData]);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
            {/* Header: Title and Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Income vs Expenses
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Apr to Mar (12 Months)
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0f5132] dark:bg-[#10b981]" />
                        <span>Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#86efac] dark:bg-[#34d399]" />
                        <span>Expenses</span>
                    </div>
                </div>
            </div>

            {/* Mobile swipe hint */}
            <div className="flex sm:hidden items-center justify-end text-[10px] text-slate-400 mb-1">
                <span>Swipe &rarr;</span>
            </div>

            {/* Chart Area with Pinned Y-Axis on Left and Scrollable Bars on Right */}
            <div className="w-full flex h-64 sm:h-72 relative">
                {!isMounted || isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="animate-pulse text-sm text-slate-400">Loading chart data...</div>
                    </div>
                ) : monthsData?.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                        No financial data available for this period.
                    </div>
                ) : (
                    <>
                        {/* 1. PINNED Y-AXIS (100% Reliable, Fixed on Mobile & Desktop, Never Disappears) */}
                        <div
                            className="w-10 shrink-0 h-full flex flex-col justify-between text-right pr-2 text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80"
                            style={{ paddingTop: "6px", paddingBottom: "32px" }}
                        >
                            {yTicks?.map?.((tick, idx) => (
                                <span
                                    key={idx}
                                    className={`leading-none ${
                                        idx === 0
                                            ? "translate-y-1"
                                            : idx === yTicks.length - 1
                                            ? "-translate-y-0.5"
                                            : ""
                                    }`}
                                >
                                    {tick?.label}
                                </span>
                            ))}
                        </div>

                        {/* 2. SCROLLABLE BARS AREA (Auto-swipes to active months on mobile, full width on desktop) */}
                        <div
                            ref={scrollContainerRef}
                            className="flex-1 overflow-x-auto overflow-y-hidden pb-2 scrollbar-thin scroll-smooth"
                        >
                            <div className="min-w-[540px] sm:min-w-full h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={monthsData}
                                        margin={{ top: 10, right: 16, left: 6, bottom: 0 }}
                                        barGap={3}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="currentColor"
                                            className="text-slate-100 dark:text-slate-800"
                                        />
                                        <XAxis
                                            dataKey="label"
                                            height={30}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={0}
                                            tick={{
                                                fontSize: 11,
                                                fill: "#94a3b8",
                                            }}
                                        />
                                        {/* Invisible YAxis with identical domain/ticks to keep gridlines aligned */}
                                        <YAxis
                                            domain={[0, maxVal]}
                                            tickCount={5}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={false}
                                            width={0}
                                        />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{ fill: "rgba(0,0,0,0.03)" }}
                                        />
                                        <Bar
                                            dataKey="income"
                                            name="Income"
                                            fill="#0f5132"
                                            radius={[3, 3, 0, 0]}
                                            maxBarSize={12}
                                        />
                                        <Bar
                                            dataKey="expenses"
                                            name="Expenses"
                                            fill="#86efac"
                                            radius={[3, 3, 0, 0]}
                                            maxBarSize={12}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default IncomeExpenseChartCard;
