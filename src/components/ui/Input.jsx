"use client";

import React, { forwardRef } from "react";

const Input = forwardRef(function Input(
    {
        label,
        error,
        helperText,
        icon: Icon,
        rightElement,
        id,
        name,
        type = "text",
        placeholder,
        disabled = false,
        required = false,
        className = "",
        inputClassName = "",
        ...props
    },
    ref
) {
    const inputId = id || name;

    return (
        <div className={`w-full flex flex-col space-y-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between"
                >
                    <span>
                        {label}
                        {required && <span className="text-rose-500 ml-1">*</span>}
                    </span>
                </label>
            )}

            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Icon className="w-5 h-5" />
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    name={name}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 outline-none
                        ${Icon ? "pl-11" : "pl-4"}
                        ${rightElement ? "pr-12" : "pr-4"}
                        py-2.5
                        ${
                            error
                                ? "border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                        }
                        ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800" : ""}
                        ${inputClassName}
                    `}
                    {...props}
                />

                {rightElement && (
                    <div className="absolute right-3 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>

            {error && (
                <p role="alert" className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{error}</span>
                </p>
            )}

            {!error && helperText && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {helperText}
                </p>
            )}
        </div>
    );
});

export default Input;
