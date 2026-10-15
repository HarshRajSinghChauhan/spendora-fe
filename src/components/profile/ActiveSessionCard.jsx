"use client";

import React from "react";
import { User, Mail, Shield } from "lucide-react";

const ActiveSessionCard = ({ user }) => {
    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                        Active Session Details
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Current authenticated session information and privileges
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Now</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1 text-slate-400 dark:text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>User Identifier / Name</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white block truncate">
                        {user?.name || "Not provided"}
                    </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1 text-slate-400 dark:text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Address</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {user?.email || "Unknown"}
                    </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1 text-slate-400 dark:text-slate-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Role / Access Level</span>
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">
                        {user?.role || "USER"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ActiveSessionCard;
