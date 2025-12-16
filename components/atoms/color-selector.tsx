"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <TooltipProvider delayDuration={100}>
      <div className={cn("flex gap-2", className)}>
        {ACCENT_COLORS.map((c) => (
          <Tooltip key={c.value}>
            <TooltipTrigger asChild>
              <button
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
                  backgroundColor: c.color,
                }}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="px-1.5 py-0.5 text-[10px]">
              {c.value}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
