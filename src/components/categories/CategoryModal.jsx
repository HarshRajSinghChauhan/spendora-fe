"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { X, Tag, ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CategoryModal({
    isOpen,
    onClose,
    initialData = null,
    existingCategories = [],
    onSubmit,
    isLoading = false,
}) {
    const isEdit = Boolean(initialData?.id);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            type: "EXPENSE",
        },
    });

    const selectedType = useWatch({ control, name: "type" });

    // Populate on open / edit
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name || "",
                    type: initialData.type || "EXPENSE",
                });
            } else {
                reset({
                    name: "",
                    type: "EXPENSE",
                });
            }
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    const handleFormSubmit = async (values) => {
        await onSubmit({
            name: values.name.trim(),
            type: values.type,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {isEdit ? "Edit Category" : "Create New Category"}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isEdit
                                ? "Update your custom category details"
                                : "Add a custom category to organize transactions"}
                        </p>
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

                {/* Form Body */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
                    {/* Category Type Segmented Switch */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Category Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setValue("type", "EXPENSE")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    selectedType === "EXPENSE"
                                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                <ArrowDownCircle className="w-4 h-4" />
                                <span>Expense</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("type", "INCOME")}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                                    selectedType === "INCOME"
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                            >
                                <ArrowUpCircle className="w-4 h-4" />
                                <span>Income</span>
                            </button>
                        </div>
                    </div>

                    {/* Category Name */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="cat-name"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                        >
                            Category Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3.5 pointer-events-none text-slate-400">
                                <Tag className="w-4 h-4" />
                            </div>
                            <input
                                id="cat-name"
                                type="text"
                                placeholder="e.g., Dining Out, Streaming, Consulting"
                                maxLength={100}
                                {...register("name", {
                                    required: "Category name is required (2–100 characters)",
                                    minLength: {
                                        value: 2,
                                        message: "Category name is required (2–100 characters)",
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Category name is required (2–100 characters)",
                                    },
                                    validate: (value) => {
                                        const trimmed = value.trim();
                                        if (trimmed.length < 2) {
                                            return "Category name is required (2–100 characters)";
                                        }
                                        // Case-insensitive duplicate check within same type
                                        const duplicate = existingCategories.find(
                                            (c) =>
                                                c.type === selectedType &&
                                                c.name.toLowerCase() === trimmed.toLowerCase() &&
                                                c.id !== initialData?.id
                                        );
                                        if (duplicate) {
                                            return `A category named "${trimmed}" already exists for ${selectedType.toLowerCase()}s.`;
                                        }
                                        return true;
                                    },
                                })}
                                className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 pl-10 pr-4 transition-all outline-none ${
                                    errors.name
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                                }`}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{errors.name.message}</span>
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
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
                            {isEdit ? "Update Category" : "Create Category"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
