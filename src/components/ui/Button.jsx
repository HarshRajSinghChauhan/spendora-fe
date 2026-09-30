"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    className = "",
    icon: Icon,
    iconPosition = "left",
    ...props
}) {
    const baseStyles =
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 select-none disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";

    const sizeStyles = {
        sm: "text-xs px-3.5 py-2 gap-1.5",
        md: "text-sm px-4 py-2.5 gap-2",
        lg: "text-base px-6 py-3.5 gap-2.5",
    };

    const variantStyles = {
        primary:
            "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 hover:shadow-emerald-600/30 focus:ring-emerald-500/25 border border-emerald-500/30",
        secondary:
            "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:ring-slate-300 dark:focus:ring-slate-700 shadow-sm",
        outline:
            "bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 focus:ring-emerald-500/25",
        ghost:
            "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-slate-300",
        danger:
            "bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 focus:ring-rose-500/25 border border-rose-500/30",
    };

    const isInteractionDisabled = disabled || isLoading;

    return (
        <button
            type={type}
            disabled={isInteractionDisabled}
            className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {Icon && iconPosition === "left" && (
                        <Icon className="w-4 h-4 shrink-0" />
                    )}
                    {children}
                    {Icon && iconPosition === "right" && (
                        <Icon className="w-4 h-4 shrink-0" />
                    )}
                </>
            )}
        </button>
    );
}
