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
  isColorMode,
  isThemeId,
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

function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme && isThemeId(storedTheme) ? storedTheme : DEFAULT_THEME;
}

function readStoredColorMode(): ColorMode {
  if (typeof window === "undefined") {
    return DEFAULT_COLOR_MODE;
  }

  const storedMode = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  return storedMode && isColorMode(storedMode) ? storedMode : DEFAULT_COLOR_MODE;
}

function readSystemMode(): ResolvedColorMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readStoredTheme);
  const [colorMode, setColorModeState] = useState<ColorMode>(readStoredColorMode);
  const [systemMode, setSystemMode] = useState<ResolvedColorMode>(readSystemMode);
  const resolvedMode = colorMode === "system" ? systemMode : colorMode;

  useEffect(() => {
    applyThemeToDocument(theme, colorMode);
  }, [theme, colorMode]);

  useEffect(() => {
    if (colorMode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemMode(e.matches ? "dark" : "light");
      applyThemeToDocument(theme, "system");
    };

    handleChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

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
