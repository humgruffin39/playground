"use client";

import type { Settings } from "@/types";
import { IconBrightness } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  theme: Settings["theme"];
  onChange: (theme: Settings["theme"]) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const [displayTheme, setDisplayTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = () => {
        setDisplayTheme(mq.matches ? "dark" : "light");
      };
      updateTheme();
      mq.addEventListener("change", updateTheme);
      return () => mq.removeEventListener("change", updateTheme);
    } else {
      setDisplayTheme(theme);
    }
  }, [theme]);

  const handleClick = () => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      onChange(isDark ? "light" : "dark");
    } else {
      const next = theme === "light" ? "dark" : "light";
      onChange(next);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      title={`Theme: ${displayTheme}`}
    >
      <IconBrightness size={18} stroke={1.5} />
    </button>
  );
}
