"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useCallback,
    useSyncExternalStore,
} from "react";

const ThemeContext = createContext({
    theme: "dark",
    isDark: true,
    toggleTheme: () => {},
    setTheme: () => {},
    mounted: false,
});

const STORAGE_KEY = "spendora_theme";
const THEME_CHANGE_EVENT = "spendora-theme-change";

const applyThemeClass = (targetTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (targetTheme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
    } else {
        root.classList.remove("dark");
        root.classList.add("light");
    }
};

const subscribe = (callback) => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", callback);
    window.addEventListener(THEME_CHANGE_EVENT, callback);

    const media = window?.matchMedia?.("(prefers-color-scheme: dark)");
    media?.addEventListener?.("change", callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(THEME_CHANGE_EVENT, callback);
        media?.removeEventListener?.("change", callback);
    };
};

const getSnapshot = () => {
    if (typeof window === "undefined") return "dark";
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
        return window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
    } catch {
        return "dark";
    }
};

const getServerSnapshot = () => "dark";

const emptySubscribe = () => () => {};

export const ThemeProvider = ({ children }) => {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    useEffect(() => {
        applyThemeClass(theme);
    }, [theme]);

    const setTheme = useCallback((newTheme) => {
        const safeTheme = newTheme === "light" ? "light" : "dark";
        try {
            localStorage.setItem(STORAGE_KEY, safeTheme);
        } catch {}
        applyThemeClass(safeTheme);
        window?.dispatchEvent?.(new Event(THEME_CHANGE_EVENT));
    }, []);

    const toggleTheme = useCallback(() => {
        const current = getSnapshot();
        const next = current === "dark" ? "light" : "dark";
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {}
        applyThemeClass(next);
        window?.dispatchEvent?.(new Event(THEME_CHANGE_EVENT));
    }, []);

    const isDark = theme === "dark";

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export default ThemeContext;
