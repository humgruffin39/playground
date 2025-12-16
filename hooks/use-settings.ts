"use client";

import {
  ACCENT_COLORS,
  DEFAULT_SETTINGS,
  EDITOR_FONTS,
  type AccentColor,
  type EditorFont,
  type Settings,
} from "@/types";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "playground-settings";

function getStoredSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function applyTheme(theme: Settings["theme"]) {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

function applyAccentColor(color: AccentColor) {
  if (color === "orange") {
    document.documentElement.style.setProperty("--primary", "#FF6900");
    document.documentElement.style.setProperty(
      "--primary-foreground",
      "#FFFFFF"
    );
  } else {
    const accent = ACCENT_COLORS.find((c) => c.value === color);
    if (accent) {
      document.documentElement.style.setProperty(
        "--accent-hue",
        String(accent.hue)
      );
      document.documentElement.style.setProperty(
        "--accent-chroma",
        String(accent.chroma)
      );
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--primary-foreground");
    }
  }
}

function applyFont(font: EditorFont) {
  const fontData = EDITOR_FONTS.find((f) => f.value === font);
  if (fontData) {
    document.documentElement.style.setProperty(
      "--editor-font",
      `var(--font-${font})`
    );
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = getStoredSettings();
    setSettingsState(stored);
    applyTheme(stored.theme);
    applyAccentColor(stored.accentColor);
    applyFont(stored.font);

    if (stored.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (updates.theme !== undefined) {
        applyTheme(next.theme);
        applyAccentColor(next.accentColor);
      }
      if (updates.accentColor !== undefined)
        applyAccentColor(updates.accentColor);
      if (updates.font !== undefined) applyFont(updates.font);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSettingsState(DEFAULT_SETTINGS);
    applyTheme(DEFAULT_SETTINGS.theme);
    applyAccentColor(DEFAULT_SETTINGS.accentColor);
    applyFont(DEFAULT_SETTINGS.font);
  }, []);

  const isDark =
    settings.theme === "dark" ||
    (settings.theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return { settings, updateSettings, resetSettings, isDark };
}
