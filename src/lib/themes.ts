export type ThemeId = "midnight" | "paper" | "mono" | "forest";
export type ColorMode = "light" | "dark" | "system";
export type ResolvedColorMode = "light" | "dark";

export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  description: string;
  swatches: {
    background: string;
    surface: string;
    accent: string;
  };
  defaultMode: ColorMode;
};

export const THEME_STORAGE_KEY = "ssj-theme";
export const COLOR_MODE_STORAGE_KEY = "ssj-color-mode";
export const DEFAULT_THEME: ThemeId = "midnight";
export const DEFAULT_COLOR_MODE: ColorMode = "system";

export const themes: ThemeDefinition[] = [
  {
    id: "midnight",
    label: "Midnight Glass",
    description: "Clean SaaS polish with sky accents. Perfect for focused night journaling.",
    swatches: { background: "#050816", surface: "#0b1225", accent: "#38bdf8" },
    defaultMode: "dark",
  },
  {
    id: "paper",
    label: "Warm Paper",
    description: "Cozy notebook feel with terracotta warmth. For intimate, reflective writing.",
    swatches: { background: "#faf6ef", surface: "#fffdf8", accent: "#c45c26" },
    defaultMode: "light",
  },
  {
    id: "mono",
    label: "Minimal Mono",
    description: "Distraction-free editorial simplicity. Maximum focus, minimum chrome.",
    swatches: { background: "#ffffff", surface: "#f9f9f9", accent: "#000000" },
    defaultMode: "light",
  },
  {
    id: "forest",
    label: "Forest Sanctuary",
    description: "Calm nature-inspired greens. Ideal for mindfulness and wellness journaling.",
    swatches: { background: "#f4f7f4", surface: "#eef3ee", accent: "#3d7a5a" },
    defaultMode: "light",
  },
];

export type UserPreferences = {
  theme: ThemeId;
  colorMode: ColorMode;
};

export function isThemeId(value: string): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

export function isColorMode(value: string): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
}

export function resolveColorMode(colorMode: ColorMode): ResolvedColorMode {
  if (colorMode === "light" || colorMode === "dark") {
    return colorMode;
  }

  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export function applyThemeToDocument(theme: ThemeId, colorMode: ColorMode) {
  const resolved = resolveColorMode(colorMode);
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-mode", resolved);
  document.documentElement.style.colorScheme = resolved;
}
