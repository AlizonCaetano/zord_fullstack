import { useEffect, useState } from "react";

export type Theme = "dark" | "navy";

const STORAGE_KEY = "theme";

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "navy" ? "navy" : "dark";
}

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "navy");
    root.classList.add(theme === "navy" ? "navy" : "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme((current) => (current === "dark" ? "navy" : "dark"));
  };

  return { theme, toggleTheme };
}
