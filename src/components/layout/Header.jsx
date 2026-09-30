"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    Wallet,
    Plus,
    Bell,
    User,
    Sparkles,
    Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const PAGE_TITLES = {
    "/dashboard": "Dashboard",
    "/transactions": "Transactions",
    "/budgets": "Budgets",
    "/categories": "Categories",
    "/analytics": "Analytics",
    "/goals": "Savings Goals",
    "/profile": "Account Profile",
    "/admin": "Admin Control Panel",
};

export default function Header({
    onOpenMobileSidebar = () => {},
    onQuickAddClick,
}) {
    const pathname = usePathname();
    const { user } = useAuth();

    const currentTitle = PAGE_TITLES[pathname] || "Dashboard";

    const getInitials = (name, email) => {
        if (name) {
            const parts = name.trim().split(" ");
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            }
            return name.slice(0, 2).toUpperCase();
        }
        if (email) {
            return email.slice(0, 2).toUpperCase();
        }
        return "SP";
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Left: Mobile Hamburger & Page Context */}
                <div className="flex items-center gap-3">
                    {/* Mobile Hamburger Trigger */}
                    <button
                        type="button"
                        onClick={onOpenMobileSidebar}
                        aria-label="Open navigation menu"
                        className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Mobile Brand Icon (when sidebar is closed) */}
                    <Link
                        href="/dashboard"
                        className="lg:hidden flex items-center gap-2"
                    >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                            <Wallet className="w-4 h-4 stroke-[2.2]" />
                        </div>
                    </Link>

                    {/* Desktop Current Page Title */}
                    <div className="hidden sm:block">
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            {currentTitle}
                        </h1>
                    </div>
                </div>

                {/* Right: Quick Action & User Profile Info */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Quick Add Button */}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onQuickAddClick}
                        icon={Plus}
                        className="text-xs font-semibold py-2 px-3 shadow-emerald-500/20"
                    >
                        <span className="hidden sm:inline">Add Transaction</span>
                        <span className="sm:hidden">Add</span>
                    </Button>

                    {/* Role / User Badge */}
                    <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                        <div className="text-right">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                                {user?.name || "Welcome"}
                            </p>
                            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 capitalize">
                                {user?.role || "Personal"}
                            </p>
                        </div>
                    </div>

                    {/* User Avatar */}
                    <Link
                        href="/profile"
                        title="View Profile"
                        className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-emerald-500/20 hover:scale-105 transition-transform"
                    >
                        {getInitials(user?.name, user?.email)}
                    </Link>
                </div>
            </div>
        </header>
    );
}
