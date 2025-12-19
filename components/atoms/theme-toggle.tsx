"use client";

import type { Settings } from "@/types";
import { IconBrightness } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

interface ThemeToggleProps {
  theme: Settings["theme"];
  onChange: (theme: Settings["theme"]) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial sync with browser state
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const displayTheme = useMemo(() => {
    if (theme === "system") return systemDark ? "dark" : "light";
    return theme;
  }, [theme, systemDark]);

  const handleClick = () => {
    if (theme === "system") {
      onChange(systemDark ? "light" : "dark");
    } else {
      onChange(theme === "light" ? "dark" : "light");
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Toggle theme, current: ${displayTheme}`}
      className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      title={`Theme: ${displayTheme}`}
    >
      <IconBrightness size={18} stroke={1.5} />
    </button>
  );
}
