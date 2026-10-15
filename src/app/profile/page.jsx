"use client";

import React from "react";
import { User, Sparkles, ShieldCheck, Palette, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import ActiveSessionCard from "@/components/profile/ActiveSessionCard";

const ProfilePage = () => {
    const { user } = useAuth();

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
        <AppLayout>
            <div className="space-y-8">
                {/* Profile Header Banner */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white shadow-xl shadow-emerald-600/10 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Avatar */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-inner shrink-0">
                            {getInitials(user?.name, user?.email)}
                        </div>

                        {/* User Details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                    <span>{user?.role || "USER"} Account</span>
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                                {user?.name || user?.email?.split("@")?.[0] || "User Profile"}
                            </h1>
                            <p className="text-xs sm:text-sm text-emerald-100 truncate">
                                {user?.email || "No email available"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Session Details Card (Moved from Dashboard) */}
                <ActiveSessionCard user={user} />

                {/* Profile Roadmap / Coming Soon Preview Section */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                Account Management & Preferences
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Additional self-service modules planned for upcoming updates
                            </p>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Coming Soon
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 opacity-80">
                            <div className="p-2 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                <User className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                                Edit Profile Info
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Update display name and manage account details.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 opacity-80">
                            <div className="p-2 w-fit rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                                Security & Password
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Change current password and manage auth credentials.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 opacity-80">
                            <div className="p-2 w-fit rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                <Palette className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                                App Preferences
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Theme mode selection and currency formatting.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 opacity-80">
                            <div className="p-2 w-fit rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                                Danger Zone
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Account deactivation and data retention options.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ProfilePage;
