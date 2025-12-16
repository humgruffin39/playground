"use client";

import type { EditorTheme, Language } from "@/types";
import { useEffect, useState } from "react";
import type { BundledLanguage, Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

const ALL_THEMES = [
  "github-dark",
  "github-light",
  "vitesse-dark",
  "vitesse-light",
  "one-dark-pro",
  "one-light",
  "dracula",
  "nord",
  "tokyo-night",
  "min-light",
  "slack-ochin",
  "solarized-light",
] as const;

async function getHighlighter() {
  if (!highlighterPromise) {
    const { createHighlighter } = await import("shiki");
    highlighterPromise = createHighlighter({
      themes: [...ALL_THEMES],
      langs: ["javascript", "typescript"],
    });
  }
  return highlighterPromise;
}

const LANG_MAP: Record<Language, BundledLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
};

export function useShiki(code: string, language: Language, theme: EditorTheme) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const highlighter = await getHighlighter();
        if (cancelled) return;
        setHtml(
          highlighter.codeToHtml(code || " ", {
            lang: LANG_MAP[language],
            theme,
          })
        );
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  return html;
}
