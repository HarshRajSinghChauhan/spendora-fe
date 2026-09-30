"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    Plus,
    Tags,
    Globe,
    User,
    Search,
    X,
    FolderPlus,
    RefreshCw,
    Shield,
    Sparkles,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import categoriesApi from "@/services/cateogories.api";
import CategoryCard from "@/components/categories/CategoryCard";
import CategoryModal from "@/components/categories/CategoryModal";
import DeleteCategoryModal from "@/components/categories/DeleteCategoryModal";

export default function CategoriesPage() {
    const queryClient = useQueryClient();

    // Tab state: "ALL" | "EXPENSE" | "INCOME"
    const [selectedTab, setSelectedTab] = useState("ALL");
    // Search query state
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);

    // 1. Fetch categories
    const {
        data: categoriesData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await categoriesApi.getAllCategories({ limit: 100 });
            return res?.data?.categories || res?.data?.category || res?.categories || res?.category || [];
        },
    });

    const allCategories = useMemo(
        () => (Array.isArray(categoriesData) ? categoriesData : []),
        [categoriesData]
    );

    // 2. Mutations
    const createMutation = useMutation({
        mutationFn: (data) => categoriesApi.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Category created successfully!");
            setIsCreateModalOpen(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to create category");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => categoriesApi.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Category updated successfully!");
            setEditingCategory(null);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to update category");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => categoriesApi.deleteCategoryById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Category deleted successfully!");
            setDeletingCategory(null);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to delete category");
        },
    });

    // 3. Tab & Search Filtering
    const filteredCategories = useMemo(() => {
        let list = allCategories.filter((c) => !c.isDisabled);

        if (selectedTab !== "ALL") {
            list = list.filter((c) => c.type === selectedTab);
        }

        if (searchQuery.trim()) {
            const term = searchQuery.toLowerCase().trim();
            list = list.filter((c) => c.name && c.name.toLowerCase().includes(term));
        }

        return list;
    }, [allCategories, selectedTab, searchQuery]);

    // Split into Custom vs Global
    const customCategories = useMemo(
        () => filteredCategories.filter((c) => !c.isGlobal),
        [filteredCategories]
    );

    const globalCategories = useMemo(
        () => filteredCategories.filter((c) => c.isGlobal),
        [filteredCategories]
    );

    // Tab counts
    const tabCounts = useMemo(() => {
        const active = allCategories.filter((c) => !c.isDisabled);
        return {
            all: active.length,
            expense: active.filter((c) => c.type === "EXPENSE").length,
            income: active.filter((c) => c.type === "INCOME").length,
            custom: active.filter((c) => !c.isGlobal).length,
            global: active.filter((c) => c.isGlobal).length,
        };
    }, [allCategories]);

    return (
        <AppLayout onQuickAddClick={() => setIsCreateModalOpen(true)}>
            <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Categories
                            </h1>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                {tabCounts.all} Active
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Organize your finances with system defaults and personalized custom tags.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="md"
                            icon={Plus}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create Category
                        </Button>
                    </div>
                </div>

                {/* Quick Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total Categories */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Categories
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {tabCounts.all}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Tags className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Custom Categories */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                My Custom Tags
                            </p>
                            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                {tabCounts.custom}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Global Categories */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                System Defaults
                            </p>
                            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                {tabCounts.global}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                            <Globe className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Toolbar: Tab Navigation & Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 sm:p-4 shadow-sm">
                    {/* Tab Navigation: [ All | Expense | Income ] */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setSelectedTab("ALL")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                selectedTab === "ALL"
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            <span>All</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {tabCounts.all}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab("EXPENSE")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                selectedTab === "EXPENSE"
                                    ? "bg-rose-600 text-white shadow-sm shadow-rose-600/20"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            <span>Expense</span>
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                selectedTab === "EXPENSE" ? "bg-rose-700 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}>
                                {tabCounts.expense}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab("INCOME")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                selectedTab === "INCOME"
                                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                        >
                            <span>Income</span>
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                selectedTab === "INCOME" ? "bg-emerald-700 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            }`}>
                                {tabCounts.income}
                            </span>
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[220px]">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter categories by name..."
                            className="w-full text-xs font-medium rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 py-2 pl-9 pr-8 outline-none focus:border-emerald-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                        <p className="text-sm font-semibold text-rose-500">
                            Failed to load categories from server.
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => refetch()}
                            icon={RefreshCw}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Main Content: Grouped Visual Sections */}
                {!isLoading && !isError && (
                    <div className="space-y-8">
                        {/* Section 1: User Custom Categories */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                        My Custom Categories
                                    </h2>
                                    <span className="text-xs text-slate-400 font-medium">
                                        ({customCategories.length})
                                    </span>
                                </div>
                                {customCategories.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Another</span>
                                    </button>
                                )}
                            </div>

                            {customCategories.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {customCategories.map((cat) => (
                                        <CategoryCard
                                            key={cat.id}
                                            category={cat}
                                            onEdit={(c) => setEditingCategory(c)}
                                            onDelete={(c) => setDeletingCategory(c)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                /* Section 6.3 Empty State */
                                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
                                        <FolderPlus className="w-6 h-6 stroke-[1.8]" />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-1">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            No custom categories found
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            You haven&apos;t created any custom categories yet. Create one to personalize your expense tracking!
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => setIsCreateModalOpen(true)}
                                        icon={Plus}
                                    >
                                        Create Custom Category
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Section 2: Global Platform Categories */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-500" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Global Platform Categories
                                </h2>
                                <span className="text-xs text-slate-400 font-medium">
                                    ({globalCategories.length})
                                </span>
                            </div>

                            {globalCategories.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {globalCategories.map((cat) => (
                                        <CategoryCard
                                            key={cat.id}
                                            category={cat}
                                            onEdit={() => {}}
                                            onDelete={() => {}}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                                    No default categories matching the current filter.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modals */}
                {/* Create Modal */}
                <CategoryModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    existingCategories={allCategories}
                    isLoading={createMutation.isPending}
                    onSubmit={async (data) => {
                        await createMutation.mutateAsync(data);
                    }}
                />

                {/* Edit Modal */}
                <CategoryModal
                    isOpen={Boolean(editingCategory)}
                    initialData={editingCategory}
                    existingCategories={allCategories}
                    onClose={() => setEditingCategory(null)}
                    isLoading={updateMutation.isPending}
                    onSubmit={async (data) => {
                        if (editingCategory?.id) {
                            await updateMutation.mutateAsync({
                                id: editingCategory.id,
                                data,
                            });
                        }
                    }}
                />

                {/* Delete Modal */}
                <DeleteCategoryModal
                    isOpen={Boolean(deletingCategory)}
                    category={deletingCategory}
                    onClose={() => setDeletingCategory(null)}
                    isLoading={deleteMutation.isPending}
                    onConfirm={async (id) => {
                        await deleteMutation.mutateAsync(id);
                    }}
                />
            </div>
        </AppLayout>
    );
}
