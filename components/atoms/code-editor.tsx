"use client";

import { useShiki } from "@/hooks/use-shiki";
import { cn } from "@/lib/utils";
import type { EditorTheme, Language, Settings } from "@/types";
import { useCallback, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  theme: EditorTheme;
  settings: Settings;
  onRun?: () => void;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  theme,
  settings,
  onRun,
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const html = useShiki(value, language, theme);
  const lineHeight = settings.fontSize * 1.5;
  const lines = value.split("\n");
  const fontFamily = `var(--font-${settings.font})`;

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onRun?.();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const indent = " ".repeat(settings.tabSize);
        onChange(value.substring(0, start) + indent + value.substring(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + settings.tabSize;
        });
      }
    },
    [value, onChange, settings.tabSize, onRun]
  );

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div className="absolute inset-0 flex">
        {settings.lineNumbers && (
          <div
            className="flex-shrink-0 select-none bg-muted/30 py-3 text-right text-muted-foreground/50"
            style={{ fontSize: settings.fontSize - 2, fontFamily }}
          >
            {lines.map((_, i) => (
              <div
                key={i}
                className="px-3"
                style={{ height: lineHeight, lineHeight: `${lineHeight}px` }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <div
          className={cn(
            "relative min-w-0 flex-1",
            settings.lineNumbers && "border-l border-border/30"
          )}
        >
          <pre
            ref={preRef}
            className="pointer-events-none absolute inset-0 overflow-hidden px-4 py-3"
            style={{ fontSize: settings.fontSize, fontFamily }}
          >
            <code
              className={cn(
                "shiki-code block",
                settings.wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"
              )}
              style={{ lineHeight: `${lineHeight}px`, fontFamily }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </pre>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            data-gramm="false"
            className={cn(
              "absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent px-4 py-3",
              "text-transparent caret-foreground outline-none selection:bg-primary/20",
              settings.wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"
            )}
            style={{
              fontSize: settings.fontSize,
              lineHeight: `${lineHeight}px`,
              fontFamily,
            }}
          />
        </div>
      </div>
    </div>
  );
}
