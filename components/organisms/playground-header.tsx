"use client";

import { KeyboardHelp, ShareButton, ThemeToggle } from "@/components/atoms";
import { LanguageSelector, SettingsPanel } from "@/components/molecules";
import type { Language, Settings } from "@/types";

interface PlaygroundHeaderProps {
  language: Language;
  code: string;
  settings: Settings;
  isDark: boolean;
  onLanguageChange: (lang: Language) => void;
  onSettingsChange: (updates: Partial<Settings>) => void;
  onSettingsReset: () => void;
}

export function PlaygroundHeader({
  language,
  code,
  settings,
  isDark,
  onLanguageChange,
  onSettingsChange,
  onSettingsReset,
}: PlaygroundHeaderProps) {
  return (
    <header className="flex h-10 min-w-0 items-center justify-between border-b px-2">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span className="hidden px-2 text-sm font-semibold md:inline">
          Playground
        </span>
        <LanguageSelector value={language} onChange={onLanguageChange} />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <KeyboardHelp />
        <SettingsPanel
          settings={settings}
          isDark={isDark}
          onChange={onSettingsChange}
          onReset={onSettingsReset}
        />
        <ThemeToggle
          theme={settings.theme}
          onChange={(theme) => onSettingsChange({ theme })}
        />
        <ShareButton code={code} language={language} />
      </div>
    </header>
  );
}
