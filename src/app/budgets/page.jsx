"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    Plus,
    PiggyBank,
    TrendingUp,
    TrendingDown,
    ShieldAlert,
    Wallet,
    Layers,
    RotateCcw,
    Sparkles,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import budgetsApi from "@/services/budgets.api";
import categoriesApi from "@/services/cateogories.api";
import BudgetCard from "@/components/budgets/BudgetCard";
import BudgetModal from "@/components/budgets/BudgetModal";
import DeleteBudgetModal from "@/components/budgets/DeleteBudgetModal";
import BudgetFilters from "@/components/budgets/BudgetFilters";
import BudgetPagination from "@/components/budgets/BudgetPagination";

export default function BudgetsPage() {
    const queryClient = useQueryClient();

    // Query & Pagination states
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [budgetType, setBudgetType] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [activeStatus, setActiveStatus] = useState("");
    const [isRecurring, setIsRecurring] = useState("");

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [deletingBudget, setDeletingBudget] = useState(null);

    // 1. Fetch Categories for budget dropdowns & filters
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await categoriesApi.getAllCategories({ limit: 100 });
            return res?.data?.category || res?.data?.categories || res?.category || [];
        },
        staleTime: 5 * 60 * 1000,
    });
    const categoriesList = useMemo(
        () => (Array.isArray(categoriesData) ? categoriesData : []),
        [categoriesData]
    );

    // 2. Prepare API Query Params
    const apiParams = useMemo(() => {
        const p = {
            page,
            limit,
        };
        if (budgetType) p.budgetType = budgetType;
        if (categoryId && categoryId !== "OVERALL") p.categoryId = categoryId;
        if (activeStatus !== "") p.active = activeStatus === "true";
        if (isRecurring !== "") p.isRecurring = isRecurring === "true";
        return p;
    }, [page, limit, budgetType, categoryId, activeStatus, isRecurring]);

    // 3. Fetch Budgets
    const {
        data: budgetsResponse,
        isLoading: isBudgetsLoading,
        isFetching,
    } = useQuery({
        queryKey: ["budgets", apiParams],
        queryFn: async () => {
            const res = await budgetsApi.getAllBudgets(apiParams);
            return res?.data || res;
        },
        placeholderData: (prev) => prev,
    });

    const rawBudgets = useMemo(
        () => budgetsResponse?.budgets || [],
        [budgetsResponse?.budgets]
    );
    const pagination = budgetsResponse?.pagination || {
        page: 1,
        limit: 10,
        totalRecords: 0,
        totalPages: 1,
    };
    const summary = budgetsResponse?.summary || {
        totalBudgeted: 0,
        totalSpent: 0,
        totalRemaining: 0,
    };

    // 4. Client-side Search and Specific Scope Filtering
    const displayedBudgets = useMemo(() => {
        let list = [...rawBudgets];

        // Overall Expenses filter
        if (categoryId === "OVERALL") {
            list = list.filter((b) => !b.categoryId);
        }

        // Search in category name or "Overall Expenses"
        if (search.trim()) {
            const term = search.toLowerCase().trim();
            list = list.filter((b) => {
                const name = b.category?.name || "Overall Expenses";
                return name.toLowerCase().includes(term);
            });
        }

        return list;
    }, [rawBudgets, categoryId, search]);

    // Exceeded budgets count
    const exceededCount = useMemo(() => {
        return rawBudgets.filter((b) => b.isExceeded).length;
    }, [rawBudgets]);

    // 5. Mutations
    const createMutation = useMutation({
        mutationFn: (data) => budgetsApi.createBudget(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            toast.success("Budget created successfully!");
            setIsCreateModalOpen(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to create budget");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => budgetsApi.updateBudget(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            toast.success("Budget updated successfully!");
            setEditingBudget(null);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to update budget");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => budgetsApi.deleteBudget(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgets"] });
            toast.success("Budget deleted successfully!");
            setDeletingBudget(null);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to delete budget");
        },
    });

    // 6. Reset filters
    const handleResetFilters = useCallback(() => {
        setSearch("");
        setBudgetType("");
        setCategoryId("");
        setActiveStatus("");
        setIsRecurring("");
        setPage(1);
    }, []);

    const hasActiveFilters = Boolean(
        search ||
        budgetType ||
        categoryId ||
        activeStatus !== "" ||
        isRecurring !== ""
    );

    const overallSpentPct = summary.totalBudgeted > 0
        ? Number(((summary.totalSpent / summary.totalBudgeted) * 100).toFixed(1))
        : 0;

    return (
        <AppLayout onQuickAddClick={() => setIsCreateModalOpen(true)}>
            <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Budgets & Spending Limits
                            </h1>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                {pagination.totalRecords} Active Caps
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Set weekly and monthly limits to pace your spending and automatically guard against budget overruns.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="md"
                            icon={Plus}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create Budget
                        </Button>
                    </div>
                </div>

                {/* Summary Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Budgeted */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Budgeted
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                ₹{summary.totalBudgeted.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Total Spent */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Spent
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
                                ₹{summary.totalSpent.toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Total Remaining */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Remaining Buffer
                            </p>
                            <p
                                className={`text-xl sm:text-2xl font-bold ${
                                    summary.totalRemaining < 0
                                        ? "text-rose-600 dark:text-rose-400"
                                        : "text-emerald-600 dark:text-emerald-400"
                                }`}
                            >
                                {summary.totalRemaining < 0 ? "-" : ""}₹{Math.abs(summary.totalRemaining).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Overspending Alerts */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Budget Health
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {overallSpentPct}%
                            </p>
                            <p className="text-[11px] font-medium text-slate-400">
                                {exceededCount > 0 ? (
                                    <span className="text-rose-500 font-semibold">
                                        {exceededCount} {exceededCount === 1 ? "cap" : "caps"} exceeded
                                    </span>
                                ) : (
                                    "All limits healthy"
                                )}
                            </p>
                        </div>
                        <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                                exceededCount > 0
                                    ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                                    : "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400"
                            }`}
                        >
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filters Toolbar */}
                <BudgetFilters
                    search={search}
                    onSearchChange={setSearch}
                    budgetType={budgetType}
                    onBudgetTypeChange={(val) => {
                        setBudgetType(val);
                        setPage(1);
                    }}
                    categoryId={categoryId}
                    onCategoryChange={(val) => {
                        setCategoryId(val);
                        setPage(1);
                    }}
                    activeStatus={activeStatus}
                    onActiveStatusChange={(val) => {
                        setActiveStatus(val);
                        setPage(1);
                    }}
                    isRecurring={isRecurring}
                    onIsRecurringChange={(val) => {
                        setIsRecurring(val);
                        setPage(1);
                    }}
                    onResetFilters={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                    categories={categoriesList}
                />

                {/* Content: Loading, Empty, or Budgets Grid */}
                {isBudgetsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-2 pt-6">
                                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayedBudgets.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                            <PiggyBank className="w-8 h-8 stroke-[1.8]" />
                        </div>
                        <div className="max-w-md mx-auto space-y-1.5">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                {hasActiveFilters
                                    ? "No budgets match your filters"
                                    : "No spending budgets created yet"}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                {hasActiveFilters
                                    ? "Try resetting your search query, cycle selection, or status filters."
                                    : "Set monthly or weekly limits for categories like Groceries or an Overall cap to track live spending."}
                            </p>
                        </div>
                        <div className="pt-2">
                            {hasActiveFilters ? (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={RotateCcw}
                                    onClick={handleResetFilters}
                                >
                                    Clear All Filters
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="md"
                                    icon={Plus}
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    Create Your First Budget
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Budgets Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {displayedBudgets.map((budget) => (
                                <BudgetCard
                                    key={budget.id}
                                    budget={budget}
                                    onEdit={(b) => setEditingBudget(b)}
                                    onDelete={(b) => setDeletingBudget(b)}
                                />
                            ))}
                        </div>

                        {/* Pagination Bar */}
                        <BudgetPagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            totalRecords={pagination.totalRecords}
                            limit={pagination.limit}
                            onPageChange={(p) => setPage(p)}
                            onLimitChange={(l) => {
                                setLimit(l);
                                setPage(1);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Create Budget Modal */}
            <BudgetModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                categories={categoriesList}
                onSubmit={async (data) => {
                    await createMutation.mutateAsync(data);
                }}
                isLoading={createMutation.isPending}
            />

            {/* Edit Budget Modal */}
            <BudgetModal
                isOpen={Boolean(editingBudget)}
                onClose={() => setEditingBudget(null)}
                initialData={editingBudget}
                categories={categoriesList}
                onSubmit={async (data) => {
                    if (editingBudget?.id) {
                        await updateMutation.mutateAsync({
                            id: editingBudget.id,
                            data,
                        });
                    }
                }}
                isLoading={updateMutation.isPending}
            />

            {/* Delete Budget Confirmation Modal */}
            <DeleteBudgetModal
                isOpen={Boolean(deletingBudget)}
                onClose={() => setDeletingBudget(null)}
                budget={deletingBudget}
                onConfirm={async (id) => {
                    await deleteMutation.mutateAsync(id);
                }}
                isLoading={deleteMutation.isPending}
            />
        </AppLayout>
    );
}
