"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    Wallet,
    Bell,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

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

const Header = ({
    onOpenMobileSidebar = () => {},
    onQuickAddClick,
    onNotificationsClick,
}) => {
    const pathname = usePathname();
    const { user } = useAuth();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationsRef?.current &&
                !notificationsRef?.current?.contains?.(event?.target)
            ) {
                setIsNotificationsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event?.key === "Escape") {
                setIsNotificationsOpen(false);
            }
        };

        if (isNotificationsOpen) {
            document?.addEventListener?.("mousedown", handleClickOutside);
            document?.addEventListener?.("keydown", handleKeyDown);
        }

        return () => {
            document?.removeEventListener?.("mousedown", handleClickOutside);
            document?.removeEventListener?.("keydown", handleKeyDown);
        };
    }, [isNotificationsOpen]);

    const handleToggleNotifications = () => {
        setIsNotificationsOpen((prev) => !prev);
        onNotificationsClick?.();
    };

    const currentTitle = PAGE_TITLES[pathname] || "Dashboard";

    const getInitials = (name, email) => {
        if (name) {
            const parts = name?.trim?.()?.split(" ") || [];
            if (parts?.length >= 2) {
                return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
            }
            return name?.slice(0, 2)?.toUpperCase() || "SP";
        }
        if (email) {
            return email?.slice(0, 2)?.toUpperCase() || "SP";
        }
        return "SP";
    };

    return (
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
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

                {/* Right: Quick Action, Theme Toggle & User Profile Info */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Notification Dropdown Container */}
                    <div className="relative" ref={notificationsRef}>
                        <button
                            type="button"
                            onClick={handleToggleNotifications}
                            aria-label="Notifications"
                            aria-expanded={isNotificationsOpen}
                            title="Notifications"
                            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 select-none outline-none focus:ring-2 focus:ring-emerald-500/30 border border-slate-200/90 dark:border-slate-800 bg-white hover:bg-emerald-50/70 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 shadow-xs dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-emerald-400 dark:hover:border-slate-700"
                        >
                            <Bell className="w-4 h-4" />
                            <span className="sr-only">Notifications</span>
                        </button>

                        {/* Notifications Popover */}
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-4 z-50">
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Notifications
                                    </h3>
                                </div>
                                <div className="py-6 px-2 flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        No new notifications
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Dark & Light Theme Toggle */}
                    <ThemeToggle />

                    {/* Role / User Badge */}
                    <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-slate-800">
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
                        className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-emerald-500/20 hover:scale-105 transition-transform"
                    >
                        {getInitials(user?.name, user?.email)}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
