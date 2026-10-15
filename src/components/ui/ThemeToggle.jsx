"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({
    variant = "icon", // "icon" | "pill" | "row"
    className = "",
    showLabel = false,
}) {
    const { theme, isDark, toggleTheme, mounted } = useTheme();

    // Prevent hydration mismatch by rendering a matching placeholder skeleton before mount
    if (!mounted) {
        if (variant === "row") {
            return (
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 ${className}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <span>Theme</span>
                    </div>
                    <div className="w-8 h-4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
            );
        }

        if (variant === "pill") {
            return (
                <div className={`p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-9 w-20 animate-pulse ${className}`} />
            );
        }

        return (
            <div
                className={`w-9 h-9 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 animate-pulse ${className}`}
            />
        );
    }

    // 1. Full Row (e.g. inside mobile sidebar or settings list)
    if (variant === "row") {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none
                    text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60
                    ${className}
                `}
            >
                <div className="flex items-center gap-3">
                    {isDark ? (
                        <Moon className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                        <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                    <span>{isDark ? "Dark Theme" : "Light Theme"}</span>
                </div>

                {/* Sliding indicator switch */}
                <div
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                        ${isDark ? "bg-emerald-600" : "bg-slate-300"}
                    `}
                >
                    <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${isDark ? "translate-x-4" : "translate-x-0"}
                        `}
                    />
                </div>
            </button>
        );
    }

    // 2. Segmented Pill with Sun & Moon
    if (variant === "pill") {
        return (
            <div
                role="radiogroup"
                aria-label="Theme selection"
                className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 ${className}`}
            >
                <button
                    type="button"
                    onClick={() => !isDark || toggleTheme()}
                    aria-label="Switch to light theme"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        !isDark
                            ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    {showLabel && <span>Light</span>}
                </button>
                <button
                    type="button"
                    onClick={() => isDark || toggleTheme()}
                    aria-label="Switch to dark theme"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        isDark
                            ? "bg-slate-900 text-emerald-400 shadow-sm border border-slate-700"
                            : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <Moon className="w-3.5 h-3.5 text-emerald-400" />
                    {showLabel && <span>Dark</span>}
                </button>
            </div>
        );
    }

    // 3. Compact Icon Toggle Button (Default for Header)
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className={`group relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-emerald-500/30
                border border-slate-200/90 dark:border-slate-800
                bg-white hover:bg-emerald-50/70 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 shadow-xs
                dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-amber-400 dark:hover:border-slate-700
                ${className}
            `}
        >
            {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
            ) : (
                <Moon className="w-4 h-4 text-emerald-700 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
