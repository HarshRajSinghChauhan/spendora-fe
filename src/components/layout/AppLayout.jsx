"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children, onQuickAddClick }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    // Restore desktop collapsed preference from localStorage
    useEffect(() => {
        try {
            const savedState = localStorage.getItem("spendora_sidebar_collapsed");
            if (savedState !== null) {
                setIsDesktopCollapsed(savedState === "true");
            }
        } catch {
            // Ignore storage access errors
        }
    }, []);

    // Toggle and persist desktop collapsed state
    const handleToggleCollapse = () => {
        setIsDesktopCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("spendora_sidebar_collapsed", String(next));
            } catch {}
            return next;
        });
    };

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileOpen]);

    // Close mobile drawer on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isMobileOpen) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileOpen]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
                {/* Responsive Sidebar (Desktop sticky + Mobile slide-over) */}
                <Sidebar
                    isOpenMobile={isMobileOpen}
                    onCloseMobile={() => setIsMobileOpen(false)}
                    isCollapsed={isDesktopCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />

                {/* Main Content Column */}
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    {/* Top Navigation Bar */}
                    <Header
                        onOpenMobileSidebar={() => setIsMobileOpen(true)}
                        onQuickAddClick={onQuickAddClick}
                    />

                    {/* Page Content Slot */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
