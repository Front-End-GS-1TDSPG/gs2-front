import { createContext, useState, useEffect, type ReactNode } from "react";
import type { ThemeContextType } from "../types/tipoTema";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const getInitialTheme = () => {
        try {
            const stored = localStorage.getItem("theme");
            if (stored === "dark") return true;
            if (stored === "light") return false;
            return (
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
            );
        } catch {
            return false;
        }
    };

    const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

    useEffect(() => {
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch {
            // ignore write errors
        }
        
        if (typeof document !== "undefined" && document.documentElement) {
            if (isDark) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
            } else {
                document.documentElement.classList.add('light');
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark((prevIsDark) => !prevIsDark);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;