"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
            router.replace(redirectUrl);
        }
    }, [isAuthenticated, isLoading, router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Checking authentication...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
