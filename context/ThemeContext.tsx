import React, { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}) {
    const [theme, setTheme] = useState<Theme>("light")

    const toggleTheme = () =>{
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    return(
        <ThemeContext.Provider value={{theme, toggleTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useTheme = ():ThemeContextType =>{
    const context = useContext(ThemeContext)
    if(!context)
    {
        throw new Error("useTheme not found")
    }
    return context;
}