"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ArrowLeftRight,
    PiggyBank,
    Tags,
    BarChart3,
    Target,
    Shield,
    User,
    LogOut,
    Wallet,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const NAV_ITEMS = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Transactions",
        href: "/transactions",
        icon: ArrowLeftRight,
    },
    {
        name: "Budgets",
        href: "/budgets",
        icon: PiggyBank,
    },
    {
        name: "Categories",
        href: "/categories",
        icon: Tags,
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
    },
    {
        name: "Goals",
        href: "/goals",
        icon: Target,
    },
];

export const SECONDARY_NAV_ITEMS = [
    {
        name: "Profile",
        href: "/profile",
        icon: User,
    },
];

export default function Sidebar({
    isOpenMobile = false,
    onCloseMobile = () => {},
    isCollapsed = false,
    onToggleCollapse = () => {},
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isAdmin = user?.role === "ADMIN";

    const isLinkActive = (href) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname?.startsWith(href);
    };

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

    const renderNavLinks = (isMobile = false) => (
        <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                            if (isMobile) onCloseMobile();
                        }}
                        title={isCollapsed && !isMobile ? item.name : undefined}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none
                            ${
                                active
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            }
                            ${isCollapsed && !isMobile ? "justify-center px-2" : ""}
                        `}
                    >
                        {/* Active vertical pill indicator */}
                        {active && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r-full" />
                        )}

                        <Icon
                            className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                active
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                            }`}
                        />

                        {(!isCollapsed || isMobile) && (
                            <span className="truncate">{item.name}</span>
                        )}

                        {/* Hover Tooltip for collapsed desktop view */}
                        {isCollapsed && !isMobile && (
                            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                                {item.name}
                            </div>
                        )}
                    </Link>
                );
            })}

            {/* Admin Link (if elevated user) */}
            {isAdmin && (
                <Link
                    href="/admin"
                    onClick={() => {
                        if (isMobile) onCloseMobile();
                    }}
                    title={isCollapsed && !isMobile ? "Admin Panel" : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none
                        ${
                            pathname?.startsWith("/admin")
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }
                        ${isCollapsed && !isMobile ? "justify-center px-2" : ""}
                    `}
                >
                    {pathname?.startsWith("/admin") && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-500 rounded-r-full" />
                    )}

                    <Shield className="w-5 h-5 shrink-0 text-amber-500 group-hover:scale-110 transition-transform" />

                    {(!isCollapsed || isMobile) && (
                        <span className="truncate flex items-center justify-between flex-1">
                            <span>Admin Panel</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                PRO
                            </span>
                        </span>
                    )}

                    {isCollapsed && !isMobile && (
                        <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                            Admin Panel
                        </div>
                    )}
                </Link>
            )}
        </div>
    );

    const renderSecondaryNavLinks = (isMobile = false) => (
        <div className="space-y-1">
            {SECONDARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                            if (isMobile) onCloseMobile();
                        }}
                        title={isCollapsed && !isMobile ? item.name : undefined}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none
                            ${
                                active
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                            }
                            ${isCollapsed && !isMobile ? "justify-center px-2" : ""}
                        `}
                    >
                        {active && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-500 rounded-r-full" />
                        )}

                        <Icon className="w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />

                        {(!isCollapsed || isMobile) && (
                            <span className="truncate">{item.name}</span>
                        )}

                        {isCollapsed && !isMobile && (
                            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                                {item.name}
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );

    const renderUserProfile = (isMobile = false) => (
        <div
            className={`border-t border-slate-200 dark:border-slate-800 pt-3 pb-2 flex items-center
                ${isCollapsed && !isMobile ? "flex-col gap-2 justify-center px-1" : "justify-between px-3 gap-3"}
            `}
        >
            <div className="flex items-center gap-3 min-w-0">
                {/* User avatar badge */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-emerald-500/20">
                    {getInitials(user?.name, user?.email)}
                </div>

                {(!isCollapsed || isMobile) && (
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {user?.name || "Spendora User"}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                )}
            </div>

            {/* Logout button */}
            <button
                type="button"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
                className={`p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0
                    ${isCollapsed && !isMobile ? "w-full flex justify-center" : ""}
                `}
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <>
            {/* ========================================================= */}
            {/* 1. MOBILE SLIDE-OVER DRAWER (< lg screens)                 */}
            {/* ========================================================= */}
            <div
                className={`fixed inset-0 z-50 lg:hidden transition-visibility duration-300
                    ${isOpenMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}
                aria-hidden={!isOpenMobile}
            >
                {/* Backdrop Overlay */}
                <div
                    onClick={onCloseMobile}
                    className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300
                        ${isOpenMobile ? "opacity-100" : "opacity-0"}
                    `}
                />

                {/* Mobile Drawer Panel */}
                <div
                    className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-4 z-50 transform transition-transform duration-300 ease-in-out
                        ${isOpenMobile ? "translate-x-0" : "-translate-x-full"}
                    `}
                >
                    {/* Drawer Header with Logo and Close button */}
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <Link
                                href="/dashboard"
                                onClick={onCloseMobile}
                                className="flex items-center gap-2.5"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                                    <Wallet className="w-4 h-4 stroke-[2.2]" />
                                </div>
                                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                                    Spendora
                                </span>
                            </Link>

                            <button
                                type="button"
                                onClick={onCloseMobile}
                                aria-label="Close menu"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation section */}
                        <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
                            <div>
                                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Main Menu
                                </p>
                                {renderNavLinks(true)}
                            </div>

                            <div>
                                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Preferences
                                </p>
                                {renderSecondaryNavLinks(true)}
                            </div>
                        </div>
                    </div>

                    {/* Bottom User Profile */}
                    {renderUserProfile(true)}
                </div>
            </div>

            {/* ========================================================= */}
            {/* 2. DESKTOP PERMANENT / COLLAPSIBLE SIDEBAR (>= lg screens) */}
            {/* ========================================================= */}
            <aside
                className={`hidden lg:flex flex-col justify-between sticky top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-20 shrink-0
                    ${isCollapsed ? "w-20 p-3" : "w-64 p-4"}
                `}
            >
                {/* Top Brand Header */}
                <div>
                    <div
                        className={`flex items-center pb-4 border-b border-slate-100 dark:border-slate-800
                            ${isCollapsed ? "justify-center" : "justify-between"}
                        `}
                    >
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-2.5 group
                                ${isCollapsed ? "justify-center" : ""}
                            `}
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                <Wallet className="w-5 h-5 stroke-[2.2]" />
                            </div>
                            {!isCollapsed && (
                                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                                    Spendora
                                </span>
                            )}
                        </Link>

                        {/* Desktop Collapse / Expand Toggle Button */}
                        {!isCollapsed && (
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                title="Collapse Sidebar"
                                aria-label="Collapse Sidebar"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* If collapsed, show small expand button underneath */}
                    {isCollapsed && (
                        <div className="flex justify-center pt-2">
                            <button
                                type="button"
                                onClick={onToggleCollapse}
                                title="Expand Sidebar"
                                aria-label="Expand Sidebar"
                                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Navigation Menu Links */}
                    <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
                        <div>
                            {!isCollapsed && (
                                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Menu
                                </p>
                            )}
                            {renderNavLinks(false)}
                        </div>

                        <div>
                            {!isCollapsed && (
                                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Settings
                                </p>
                            )}
                            {renderSecondaryNavLinks(false)}
                        </div>
                    </div>
                </div>

                {/* Bottom User Profile Section */}
                {renderUserProfile(false)}
            </aside>
        </>
    );
}
