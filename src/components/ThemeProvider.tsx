"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  ThemeId,
  ColorMode,
  ResolvedColorMode,
  DEFAULT_THEME,
  DEFAULT_COLOR_MODE,
  THEME_STORAGE_KEY,
  COLOR_MODE_STORAGE_KEY,
  resolveColorMode,
  applyThemeToDocument,
} from "@/lib/themes";

interface ThemeContextType {
  theme: ThemeId;
  colorMode: ColorMode;
  resolvedMode: ResolvedColorMode;
  setTheme: (theme: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [colorMode, setColorModeState] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [resolvedMode, setResolvedMode] = useState<ResolvedColorMode>("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  // Initial hydration from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const storedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);

    if (storedTheme) {
      setThemeState(storedTheme as ThemeId);
    }
    if (storedMode) {
      setColorModeState(storedMode as ColorMode);
    }

    setIsHydrated(true);
  }, []);

  // Apply theme and color mode to document
  useEffect(() => {
    const resolved = resolveColorMode(colorMode);
    setResolvedMode(resolved);
    applyThemeToDocument(theme, colorMode);
  }, [theme, colorMode]);

  // Listen to system color scheme changes
  useEffect(() => {
    if (colorMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setResolvedMode(e.matches ? "dark" : "light");
      applyThemeToDocument(theme, "system");
    };

    // Initial sync
    handleChange(mediaQuery);

    // Modern listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [colorMode, theme]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const setColorMode = (newMode: ColorMode) => {
    setColorModeState(newMode);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorMode,
        resolvedMode,
        setTheme,
        setColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
