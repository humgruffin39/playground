"use client";

import { ColorSelector } from "@/components/atoms";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DARK_THEMES,
  EDITOR_FONTS,
  LIGHT_THEMES,
  type DarkTheme,
  type LightTheme,
  type Settings,
} from "@/types";
import { IconSettings } from "@tabler/icons-react";

interface SettingsPanelProps {
  settings: Settings;
  isDark: boolean;
  onChange: (updates: Partial<Settings>) => void;
  onReset: () => void;
}

export function SettingsPanel({
  settings,
  isDark,
  onChange,
  onReset,
}: SettingsPanelProps) {
  const themes = isDark ? DARK_THEMES : LIGHT_THEMES;
  const currentTheme = isDark ? settings.darkTheme : settings.lightTheme;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1.5 text-muted-foreground transition-colors hover:text-foreground">
          <IconSettings size={18} stroke={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Settings</span>
            <button
              onClick={onReset}
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">
                Syntax
              </Label>
              <div className="grid grid-cols-3 gap-1">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() =>
                      onChange(
                        isDark
                          ? { darkTheme: t.value as DarkTheme }
                          : { lightTheme: t.value as LightTheme }
                      )
                    }
                    className={`px-1.5 py-1 text-[10px] truncate ${
                      currentTheme === t.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Font</Label>
              <div className="grid grid-cols-3 gap-1">
                {EDITOR_FONTS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => onChange({ font: f.value })}
                    className={`px-1.5 py-1 text-[10px] truncate ${
                      settings.font === f.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">
                Accent
              </Label>
              <ColorSelector
                value={settings.accentColor}
                onChange={(v) => onChange({ accentColor: v })}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">
                  Size
                </Label>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {settings.fontSize}px
                </span>
              </div>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([v]) => onChange({ fontSize: v })}
                min={11}
                max={18}
                step={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">Tab</Label>
              <div className="flex gap-0.5">
                {[2, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => onChange({ tabSize: n })}
                    className={`px-2 py-0.5 text-[10px] ${
                      settings.tabSize === n
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">Lines</Label>
              <Switch
                checked={settings.lineNumbers}
                onCheckedChange={(v) => onChange({ lineNumbers: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">Wrap</Label>
              <Switch
                checked={settings.wordWrap}
                onCheckedChange={(v) => onChange({ wordWrap: v })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground">
                Auto Run
              </Label>
              <Switch
                checked={settings.autoRun}
                onCheckedChange={(v) => onChange({ autoRun: v })}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <Label className="text-[11px] text-muted-foreground">Theme</Label>
              <div className="flex gap-0.5">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => onChange({ theme: t })}
                    className={`px-1.5 py-0.5 text-[10px] capitalize ${
                      settings.theme === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
