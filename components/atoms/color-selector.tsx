"use client";

import { cn } from "@/lib/utils";
import { ACCENT_COLORS, type AccentColor } from "@/types";
import { useState } from "react";

interface ColorSelectorProps {
  value: AccentColor;
  onChange: (value: AccentColor) => void;
  className?: string;
}

export function ColorSelector({
  value,
  onChange,
  className,
}: ColorSelectorProps) {
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <div className={cn("flex gap-2", className)}>
      {ACCENT_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          onMouseDown={() => setPressed(c.value)}
          onMouseUp={() => setPressed(null)}
          onMouseLeave={() => setPressed(null)}
          className={cn(
            "size-5 rounded-full transition-transform",
            pressed === c.value && "scale-90",
            value === c.value &&
              "ring-1 ring-offset-2 ring-offset-background ring-primary"
          )}
          style={{
            backgroundColor:
              c.value === "orange"
                ? "#FF6900"
                : c.chroma === 0
                ? "oklch(0.6 0 0)"
                : `oklch(0.6 ${c.chroma} ${c.hue})`,
          }}
          title={c.value}
        />
      ))}
    </div>
  );
}
