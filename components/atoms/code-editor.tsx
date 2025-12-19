"use client";

import { useShiki } from "@/hooks";
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
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onRun?.();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        const lines = value.split("\n");
        const startLine = value.substring(0, start).split("\n").length - 1;
        const endLine = value.substring(0, end).split("\n").length - 1;
        const selectedLines = lines.slice(startLine, endLine + 1);
        const allCommented = selectedLines.every((line) =>
          line.trimStart().startsWith("//")
        );
        const newLines = lines.map((line, i) => {
          if (i >= startLine && i <= endLine) {
            return allCommented
              ? line.replace(/^(\s*)\/\/\s?/, "$1")
              : line.replace(/^(\s*)/, "$1// ");
          }
          return line;
        });
        onChange(newLines.join("\n"));
        return;
      }

      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        const indent = " ".repeat(settings.tabSize);
        onChange(value.substring(0, start) + indent + value.substring(end));
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + settings.tabSize;
        });
        return;
      }

      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        const lines = value.split("\n");
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const lineIndex = value.substring(0, start).split("\n").length - 1;
        const line = lines[lineIndex];
        const spaces = line.match(/^(\s*)/)?.[1] || "";
        const removeCount = Math.min(settings.tabSize, spaces.length);
        if (removeCount > 0) {
          lines[lineIndex] = line.substring(removeCount);
          onChange(lines.join("\n"));
          requestAnimationFrame(() => {
            const newPos = Math.max(lineStart, start - removeCount);
            ta.selectionStart = ta.selectionEnd = newPos;
          });
        }
        return;
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
