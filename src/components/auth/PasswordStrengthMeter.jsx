"use client";

import React, { useMemo } from "react";
import { Check, X } from "lucide-react";

export default function PasswordStrengthMeter({ password = "" }) {
    const analysis = useMemo(() => {
        const criteria = [
            { id: "length", label: "At least 8 characters", met: password.length >= 8 },
            { id: "uppercase", label: "One uppercase letter", met: /[A-Z]/.test(password) },
            { id: "lowercase", label: "One lowercase letter", met: /[a-z]/.test(password) },
            { id: "number", label: "One number", met: /[0-9]/.test(password) },
            { id: "special", label: "One special character (@$!%*?&...)", met: /[^A-Za-z0-9]/.test(password) },
        ];

        const score = criteria.filter((c) => c.met).length;

        let strengthLabel = "Weak";
        let strengthColor = "bg-rose-500";
        let textColor = "text-rose-600 dark:text-rose-400";
        let percent = (score / criteria.length) * 100;

        if (score === 0) {
            strengthLabel = "Too weak";
            strengthColor = "bg-slate-200 dark:bg-slate-700";
            textColor = "text-slate-400";
            percent = 0;
        } else if (score <= 2) {
            strengthLabel = "Weak";
            strengthColor = "bg-rose-500";
            textColor = "text-rose-500";
        } else if (score === 3 || score === 4) {
            strengthLabel = "Moderate";
            strengthColor = "bg-amber-500";
            textColor = "text-amber-500";
        } else if (score === 5) {
            strengthLabel = "Strong & Secure";
            strengthColor = "bg-emerald-500";
            textColor = "text-emerald-500";
        }

        return { criteria, score, strengthLabel, strengthColor, textColor, percent };
    }, [password]);

    if (!password) {
        return null;
    }

    return (
        <div className="w-full space-y-2 mt-2 pt-1 animate-fadeIn">
            {/* Header bar and label */}
            <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                <span className={`font-semibold ${analysis.textColor}`}>{analysis.strengthLabel}</span>
            </div>

            {/* Strength progress bar segments */}
            <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`h-full rounded-full transition-all duration-300 ${
                            analysis.score >= level ? analysis.strengthColor : "bg-transparent"
                        }`}
                    />
                ))}
            </div>

            {/* Checklist of requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {analysis.criteria.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-center text-[11px] transition-colors duration-200 ${
                            item.met
                                ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                : "text-slate-400 dark:text-slate-500"
                        }`}
                    >
                        {item.met ? (
                            <Check className="w-3.5 h-3.5 mr-1.5 shrink-0 stroke-[2.5]" />
                        ) : (
                            <X className="w-3.5 h-3.5 mr-1.5 shrink-0 opacity-40" />
                        )}
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
