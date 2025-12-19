"use client";

import { OutputDisplay } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { ExecutionResult, Settings } from "@/types";
import {
  IconCheck,
  IconCopy,
  IconLoader2,
  IconTrash,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

interface OutputPaneProps {
  result: ExecutionResult | null;
  settings: Settings;
  isRunning?: boolean;
  onClear?: () => void;
  className?: string;
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

export function OutputPane({
  result,
  settings,
  isRunning,
  onClear,
  className,
}: OutputPaneProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text =
      result.output.join("\n") + (result.error ? `\n${result.error}` : "");
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  const hasOutput = result && (result.output.length > 0 || result.error);

  return (
    <div className={cn("flex h-full flex-col bg-muted/20", className)}>
      <div className="flex h-8 items-center justify-between border-b bg-muted/30 px-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground">
            Output
          </span>
          {isRunning && (
            <IconLoader2
              size={12}
              className="animate-spin text-muted-foreground"
            />
          )}
          {!isRunning && result?.executionTime !== undefined && (
            <span className="text-[10px] tabular-nums text-muted-foreground/70">
              {result.executionTime}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {hasOutput && (
            <>
              <button
                onClick={handleCopy}
                aria-label="Copy output"
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                title="Copy output"
              >
                {copied ? (
                  <IconCheck size={16} stroke={1.5} />
                ) : (
                  <IconCopy size={16} stroke={1.5} />
                )}
              </button>
              <button
                onClick={onClear}
                aria-label="Clear output"
                className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                title="Clear output"
              >
                <IconTrash size={16} stroke={1.5} />
              </button>
            </>
          )}
        </div>
      </div>
      <OutputDisplay
        result={result}
        settings={settings}
        className="min-h-0 flex-1"
      />
    </div>
  );
}
