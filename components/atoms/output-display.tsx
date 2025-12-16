"use client";

import { cn } from "@/lib/utils";
import type { ExecutionResult, Settings } from "@/types";

interface OutputDisplayProps {
  result: ExecutionResult | null;
  settings: Settings;
  className?: string;
}

export function OutputDisplay({
  result,
  settings,
  className,
}: OutputDisplayProps) {
  const lineHeight = settings.fontSize * 1.5;
  const fontSize = settings.fontSize;
  const fontFamily = `var(--font-${settings.font})`;

  if (!result || (!result.output.length && !result.error)) {
    return (
      <div
        className={cn(
          "flex h-full items-center justify-center text-muted-foreground/50",
          className
        )}
        style={{ fontSize, fontFamily }}
      >
        Output will appear here
      </div>
    );
  }

  return (
    <div
      className={cn("h-full overflow-auto", className)}
      style={{ fontSize, fontFamily }}
    >
      <div className="flex min-h-full">
        {settings.lineNumbers && (
          <div
            className="sticky left-0 flex-shrink-0 select-none bg-muted/40 py-3 text-right text-muted-foreground/50"
            style={{ fontSize: fontSize - 2, fontFamily }}
          >
            {result.output.map((_, i) => (
              <div
                key={i}
                className="px-3"
                style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
              >
                {i + 1}
              </div>
            ))}
            {result.error && (
              <div
                className="px-3 text-destructive"
                style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
              >
                !
              </div>
            )}
          </div>
        )}
        <div className="flex-1 py-3">
          {result.output.map((line, i) => (
            <div
              key={i}
              className="whitespace-pre-wrap px-4"
              style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
            >
              {line}
            </div>
          ))}
          {result.error && (
            <div
              className="whitespace-pre-wrap px-4 text-destructive"
              style={{ minHeight: lineHeight, lineHeight: `${lineHeight}px` }}
            >
              {result.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
