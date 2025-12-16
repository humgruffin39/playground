"use client";

import { OutputDisplay } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { ExecutionResult, Settings } from "@/types";

interface OutputPaneProps {
  result: ExecutionResult | null;
  settings: Settings;
  className?: string;
}

export function OutputPane({ result, settings, className }: OutputPaneProps) {
  return (
    <div className={cn("flex h-full flex-col bg-muted/20", className)}>
      <div className="flex h-8 items-center border-b bg-muted/30 px-3">
        <span className="text-[11px] font-medium text-muted-foreground">
          Output
        </span>
      </div>
      <OutputDisplay
        result={result}
        settings={settings}
        className="flex-1 min-h-0"
      />
    </div>
  );
}
