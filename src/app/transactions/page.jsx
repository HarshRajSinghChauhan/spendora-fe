"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    Plus,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Receipt,
    Wallet,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import transactionsApi from "@/services/transactions.api";
import categoriesApi from "@/services/cateogories.api";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionPagination from "@/components/transactions/TransactionPagination";
import TransactionModal from "@/components/transactions/TransactionModal";
import DeleteTransactionModal from "@/components/transactions/DeleteTransactionModal";

// Helper to format Date to YYYY-MM-DD
const formatDateToISO = (date) => {
    return date.toISOString().slice(0, 10);
};

// Calculate Date Range presets
const getDateRangeForPreset = (preset) => {
    const now = new Date();
    switch (preset) {
        case "daily": {
            const today = formatDateToISO(now);
            return { from: today, to: today };
        }
        case "weekly": {
            const firstDay = new Date(now);
            firstDay.setDate(now.getDate() - now.getDay());
            return { from: formatDateToISO(firstDay), to: formatDateToISO(now) };
        }
        case "monthly": {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            return { from: formatDateToISO(firstDay), to: formatDateToISO(now) };
        }
        case "yearly": {
            const firstDay = new Date(now.getFullYear(), 0, 1);
            return { from: formatDateToISO(firstDay), to: formatDateToISO(now) };
        }
        default:
            return { from: "", to: "" };
    }
};

export default function TransactionsPage() {
    const queryClient = useQueryClient();

    // Query & Filter States
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [periodPreset, setPeriodPreset] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

    // Sorting State
    const [sortBy, setSortBy] = useState("transactionDate");
    const [sortOrder, setSortOrder] = useState("DESC");

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);

    // 1. Fetch Categories for select options
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await categoriesApi.getAllCategories({ limit: 100 });
            return res?.data?.category || res?.data?.categories || res?.category || [];
        },
        staleTime: 5 * 60 * 1000,
    });
    const categoriesList = categoriesData || [];

    // 2. Query Params for Transactions API
    const apiParams = useMemo(() => {
        const p = {
            page,
            limit,
        };
        if (type) p.type = type;
        if (fromDate) p.from = fromDate;
        if (toDate) p.to = toDate;
        return p;
    }, [page, limit, type, fromDate, toDate]);

    // 3. Fetch Transactions from Backend
    const {
        data: transactionsResponse,
        isLoading: isTransactionsLoading,
        isFetching,
    } = useQuery({
        queryKey: ["transactions", apiParams],
        queryFn: async () => {
            const res = await transactionsApi.getAllTransactions(apiParams);
            return res?.data || res;
        },
        placeholderData: (prev) => prev,
    });

    const rawTransactions = useMemo(
        () => transactionsResponse?.transactions || [],
        [transactionsResponse?.transactions]
    );
    const totalRecords = transactionsResponse?.totalRecords || 0;
    const totalPages = transactionsResponse?.totalPages || 1;
    const currentPage = transactionsResponse?.currentPage || page;

    // 4. Mutations (Create, Update, Delete)
    const createMutation = useMutation({
        mutationFn: (data) => transactionsApi.createTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Transaction created successfully");
            setIsAddModalOpen(false);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to create transaction");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => transactionsApi.updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Transaction updated successfully");
            setEditingTransaction(null);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to update transaction");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => transactionsApi.deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Transaction deleted successfully");
            setDeletingTransaction(null);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to delete transaction");
        },
    });

    // 5. Client-Side Search, Category Filter, Amount Filter, and Sorting
    const filteredAndSortedTransactions = useMemo(() => {
        let list = [...rawTransactions];

        // Search in title and notes
        if (search.trim()) {
            const term = search.toLowerCase().trim();
            list = list.filter(
                (tx) =>
                    (tx.title && tx.title.toLowerCase().includes(term)) ||
                    (tx.notes && tx.notes.toLowerCase().includes(term))
            );
        }

        // Category filter
        if (category) {
            list = list.filter(
                (tx) => tx.categoryId === category || tx.category?.id === category
            );
        }

        // Amount range filter
        if (minAmount) {
            const min = parseFloat(minAmount);
            if (!isNaN(min)) {
                list = list.filter((tx) => parseFloat(tx.amount || 0) >= min);
            }
        }
        if (maxAmount) {
            const max = parseFloat(maxAmount);
            if (!isNaN(max)) {
                list = list.filter((tx) => parseFloat(tx.amount || 0) <= max);
            }
        }

        // Sorting
        list.sort((a, b) => {
            let valA, valB;
            if (sortBy === "amount") {
                valA = parseFloat(a.amount || 0);
                valB = parseFloat(b.amount || 0);
            } else if (sortBy === "title") {
                valA = (a.title || "").toLowerCase();
                valB = (b.title || "").toLowerCase();
            } else {
                // Default date
                valA = new Date(a.transactionDate || a.createdAt).getTime();
                valB = new Date(b.transactionDate || b.createdAt).getTime();
            }

            if (valA < valB) return sortOrder === "ASC" ? -1 : 1;
            if (valA > valB) return sortOrder === "ASC" ? 1 : -1;
            return 0;
        });

        return list;
    }, [rawTransactions, search, category, minAmount, maxAmount, sortBy, sortOrder]);

    // Summary calculations based on current list
    const summaryStats = useMemo(() => {
        let income = 0;
        let expense = 0;
        rawTransactions.forEach((tx) => {
            const amt = parseFloat(tx.amount || 0);
            if (tx.type === "INCOME") {
                income += amt;
            } else {
                expense += amt;
            }
        });
        return {
            income,
            expense,
            net: income - expense,
        };
    }, [rawTransactions]);

    // Handle Period Preset Change
    const handlePeriodPresetChange = useCallback((newPreset) => {
        setPeriodPreset(newPreset);
        setPage(1);
        if (newPreset !== "custom") {
            const range = getDateRangeForPreset(newPreset);
            setFromDate(range.from);
            setToDate(range.to);
        }
    }, []);

    // Handle Custom Date Range
    const handleDateRangeChange = useCallback((from, to) => {
        setFromDate(from);
        setToDate(to);
        setPage(1);
    }, []);

    // Handle Amount Range Change
    const handleAmountRangeChange = useCallback((min, max) => {
        setMinAmount(min);
        setMaxAmount(max);
        setPage(1);
    }, []);

    // Reset All Filters
    const handleResetFilters = useCallback(() => {
        setSearch("");
        setType("");
        setCategory("");
        setPeriodPreset("all");
        setFromDate("");
        setToDate("");
        setMinAmount("");
        setMaxAmount("");
        setPage(1);
    }, []);

    const hasActiveFilters = Boolean(
        search ||
        type ||
        category ||
        periodPreset !== "all" ||
        fromDate ||
        toDate ||
        minAmount ||
        maxAmount
    );

    return (
        <AppLayout onQuickAddClick={() => setIsAddModalOpen(true)}>
            <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Transactions
                            </h1>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                                {totalRecords} Total
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Complete financial ledger of all your income and expense records.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="md"
                            icon={Plus}
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add Transaction
                        </Button>
                    </div>
                </div>

                {/* Quick Snapshot Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Net Balance */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Net Pulse (Page)
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {summaryStats.net >= 0 ? "+" : "-"}₹{Math.abs(summaryStats.net).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Total Income */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Income (Page)
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                +₹{summaryStats.income.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Total Expense */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Total Expense (Page)
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
                                -₹{summaryStats.expense.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filter & Search Toolbar */}
                <TransactionFilters
                    search={search}
                    onSearchChange={setSearch}
                    type={type}
                    onTypeChange={(newType) => {
                        setType(newType);
                        setPage(1);
                    }}
                    category={category}
                    onCategoryChange={(newCat) => {
                        setCategory(newCat);
                        setPage(1);
                    }}
                    periodPreset={periodPreset}
                    onPeriodPresetChange={handlePeriodPresetChange}
                    fromDate={fromDate}
                    toDate={toDate}
                    onDateRangeChange={handleDateRangeChange}
                    minAmount={minAmount}
                    maxAmount={maxAmount}
                    onAmountRangeChange={handleAmountRangeChange}
                    onResetFilters={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                    categories={categoriesList}
                />

                {/* Ledger Content: Desktop Table & Mobile Cards */}
                <TransactionTable
                    transactions={filteredAndSortedTransactions}
                    isLoading={isTransactionsLoading}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={(field, order) => {
                        setSortBy(field);
                        setSortOrder(order);
                    }}
                    onEdit={(tx) => setEditingTransaction(tx)}
                    onDelete={(tx) => setDeletingTransaction(tx)}
                    onAddClick={() => setIsAddModalOpen(true)}
                    onClearFilters={handleResetFilters}
                    hasFiltersApplied={hasActiveFilters}
                />

                {/* Bottom Pagination Bar */}
                <TransactionPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    limit={limit}
                    onPageChange={(newPage) => setPage(newPage)}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                />

                {/* Add Transaction Modal */}
                <TransactionModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    categories={categoriesList}
                    isLoading={createMutation.isPending}
                    onSubmit={async (data) => {
                        await createMutation.mutateAsync(data);
                    }}
                />

                {/* Edit Transaction Modal */}
                <TransactionModal
                    isOpen={Boolean(editingTransaction)}
                    initialData={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    categories={categoriesList}
                    isLoading={updateMutation.isPending}
                    onSubmit={async (data) => {
                        if (editingTransaction?.id) {
                            await updateMutation.mutateAsync({
                                id: editingTransaction.id,
                                data,
                            });
                        }
                    }}
                />

                {/* Delete Confirmation Modal */}
                <DeleteTransactionModal
                    isOpen={Boolean(deletingTransaction)}
                    transaction={deletingTransaction}
                    onClose={() => setDeletingTransaction(null)}
                    isLoading={deleteMutation.isPending}
                    onConfirm={async (id) => {
                        await deleteMutation.mutateAsync(id);
                    }}
                />
            </div>
        </AppLayout>
    );
}
