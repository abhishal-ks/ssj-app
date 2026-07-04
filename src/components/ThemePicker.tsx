"use client";

import { useTheme } from "@/components/ThemeProvider";
import { themes, ColorMode } from "@/lib/themes";
import { Button, Card, StatusPill } from "@/components/ui";
import { cn } from "@/lib/utils";

const modeLabels: Record<ColorMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export default function ThemePicker() {
  const { theme, colorMode, setTheme, setColorMode, resolvedMode } = useTheme();

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Theme settings</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Choose your look</h1>
            <span className="mt-2 h-px w-16 bg-accent/50" />
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Pick a journal theme and switch between light, dark, or system mode. Your selection is saved locally.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-border/70 bg-surface/80 px-3 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
            <StatusPill color="accent">Current theme</StatusPill>
            <span className="text-sm text-muted">{theme} • {modeLabels[resolvedMode]}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {themes.map((themeOption) => {
            const isActive = themeOption.id === theme;
            return (
              <button
                key={themeOption.id}
                type="button"
                onClick={() => setTheme(themeOption.id)}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border-0 p-5 text-left shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer",
                  isActive ? "bg-surface-strong" : "bg-surface/80 hover:bg-surface-strong"
                )}
                aria-pressed={isActive}
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-accent/70" />
                <div className="mb-4 ml-3 flex items-center justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{themeOption.label}</p>
                    <p className="text-xs text-muted">{themeOption.description}</p>
                  </div>
                  {isActive ? (
                    <span className="inline-flex rounded-full bg-accent/15 px-2 py-1 text-xs font-semibold text-accent">
                      Selected
                    </span>
                  ) : null}
                </div>
                <div className="ml-3 grid gap-2">
                  <div
                    className="h-16 rounded-2xl border border-border"
                    style={{ backgroundColor: themeOption.swatches.background }}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <span className="h-8 rounded-2xl border border-border" style={{ backgroundColor: themeOption.swatches.background }} />
                    <span className="h-8 rounded-2xl border border-border" style={{ backgroundColor: themeOption.swatches.surface }} />
                    <span className="h-8 rounded-2xl border border-border" style={{ backgroundColor: themeOption.swatches.accent }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Color mode</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">Choose a mode</h2>
            <span className="mt-2 h-px w-16 bg-accent/50" />
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Light mode for daytime reading, dark mode for evening focus, or system for automatic switching.
            </p>
          </div>
          <div className="rounded-[22px] border-0 bg-surface/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-medium text-foreground">Resolved mode</p>
            <p className="mt-1 text-sm text-muted">{modeLabels[resolvedMode]}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {(["light", "dark", "system"] as ColorMode[]).map((modeOption) => {
            const isSelected = modeOption === colorMode;
            return (
              <button
                type="button"
                key={modeOption}
                onClick={() => setColorMode(modeOption)}
                className={cn(
                  "relative overflow-hidden rounded-[22px] border-0 p-4 text-left shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50",
                  isSelected
                    ? "bg-surface-strong"
                    : "bg-surface/80 hover:bg-surface-strong"
                )}
                aria-pressed={isSelected}
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-accent/70" />
                <div className="ml-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{modeLabels[modeOption]}</p>
                    <p className="text-sm text-muted">{modeOption === "system" ? "Follow device preference" : `Force ${modeLabels[modeOption]} mode`}</p>
                  </div>
                  {isSelected ? (
                    <StatusPill color="accent">Active</StatusPill>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
