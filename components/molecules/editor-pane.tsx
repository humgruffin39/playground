"use client";

import { CodeEditor } from "@/components/atoms";
import { cn } from "@/lib/utils";
import type { EditorTheme, Language, Settings } from "@/types";
import { IconPlayerPlay } from "@tabler/icons-react";

interface EditorPaneProps {
  code: string;
  onChange: (code: string) => void;
  language: Language;
  theme: EditorTheme;
  settings: Settings;
  onRun: () => void;
  className?: string;
}

export function EditorPane({
  code,
  onChange,
  language,
  theme,
  settings,
  onRun,
  className,
}: EditorPaneProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex h-8 items-center justify-between border-b bg-muted/30 px-3">
        <span className="text-[11px] font-medium text-muted-foreground">
          Input
        </span>
        <button
          onClick={onRun}
          aria-label="Run code (Ctrl+Enter)"
          className="flex items-center gap-1 bg-primary px-2.5 py-1 text-[10px] font-medium leading-none text-primary-foreground transition-opacity hover:opacity-90"
        >
          <IconPlayerPlay size={12} stroke={2} className="flex-shrink-0" />
          <span className="mt-0.4 leading-none">Run</span>
        </button>
      </div>
      <CodeEditor
        value={code}
        onChange={onChange}
        language={language}
        theme={theme}
        settings={settings}
        onRun={onRun}
        className="min-h-0 flex-1"
      />
    </div>
  );
}
