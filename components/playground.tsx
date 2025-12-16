"use client";

import { MobileWarning, ShareButton, ThemeToggle } from "@/components/atoms";
import {
  EditorPane,
  LanguageSelector,
  OutputPane,
  SettingsPanel,
} from "@/components/molecules";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCodeExecutor, useDebounce, useSettings } from "@/hooks";
import type { ExecutionResult, Language } from "@/types";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_CODE: Record<Language, string> = {
  javascript: `const greet = (name) => \`Hello, \${name}!\`;

console.log(greet("World"));

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log("Fibonacci(10):", fibonacci(10));`,
  typescript: `interface User {
  name: string;
  age: number;
}

const createUser = (name: string, age: number): User => ({ name, age });

const user = createUser("TypeScript", 12);
console.log(\`\${user.name} is \${user.age} years old\`);

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const ok = <T>(data: T): Result<T> => ({ ok: true, data });

console.log("Result:", ok({ id: 1 }));`,
};

function usePersistedCode() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [codes, setCodes] = useState(DEFAULT_CODE);

  useEffect(() => {
    try {
      const lang = localStorage.getItem("pg-lang") as Language | null;
      const stored = localStorage.getItem("pg-codes");
      if (lang) setLanguage(lang);
      if (stored) setCodes({ ...DEFAULT_CODE, ...JSON.parse(stored) });
    } catch {}
  }, []);

  const updateLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("pg-lang", lang);
  }, []);

  const updateCode = useCallback((lang: Language, code: string) => {
    setCodes((prev) => {
      const next = { ...prev, [lang]: code };
      localStorage.setItem("pg-codes", JSON.stringify(next));
      return next;
    });
  }, []);

  return { language, codes, updateLanguage, updateCode };
}

export function Playground() {
  const { settings, updateSettings, resetSettings, isDark } = useSettings();
  const { language, codes, updateLanguage, updateCode } = usePersistedCode();
  const { execute } = useCodeExecutor();
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [mounted, setMounted] = useState(false);

  const code = codes[language];
  const debouncedCode = useDebounce(
    code,
    settings.autoRun ? settings.debounceMs : 0
  );
  const editorTheme = isDark ? settings.darkTheme : settings.lightTheme;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (settings.autoRun && debouncedCode) {
      let cancelled = false;
      execute(debouncedCode, language).then((result) => {
        if (!cancelled) {
          setResult(result);
        }
      });
      return () => {
        cancelled = true;
      };
    }
  }, [debouncedCode, language, execute, settings.autoRun]);

  const handleRun = useCallback(() => {
    execute(code, language).then((result) => {
      setResult(result);
    });
  }, [code, language, execute]);

  const getShareUrl = useCallback(() => {
    return window.location.origin + window.location.pathname;
  }, []);

  return (
    <>
      <MobileWarning />
      <div className="flex h-screen flex-col bg-background">
        <header className="flex h-10 min-w-0 items-center justify-between border-b px-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <span className="hidden px-2 text-sm font-semibold md:inline">
              Playground
            </span>
            <LanguageSelector value={language} onChange={updateLanguage} />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <SettingsPanel
              settings={settings}
              isDark={isDark}
              onChange={updateSettings}
              onReset={resetSettings}
            />
            <ThemeToggle
              theme={settings.theme}
              onChange={(theme) => updateSettings({ theme })}
            />
            <ShareButton getShareUrl={getShareUrl} />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          {mounted ? (
            <div className="hidden md:block h-full">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={55} minSize={25}>
                  <EditorPane
                    code={code}
                    onChange={(c) => updateCode(language, c)}
                    language={language}
                    theme={editorTheme}
                    settings={settings}
                    onRun={handleRun}
                  />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={45} minSize={20}>
                  <OutputPane result={result} settings={settings} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          ) : (
            <div className="hidden md:block h-full">
              <div className="flex h-full">
                <div className="flex-1" style={{ width: "55%" }}>
                  <EditorPane
                    code={code}
                    onChange={(c) => updateCode(language, c)}
                    language={language}
                    theme={editorTheme}
                    settings={settings}
                    onRun={handleRun}
                  />
                </div>
                <div className="w-px bg-border" />
                <div className="flex-1" style={{ width: "45%" }}>
                  <OutputPane result={result} settings={settings} />
                </div>
              </div>
            </div>
          )}
          <div className="block md:hidden h-full">
            <div className="flex h-full flex-col">
              <div className="flex-1 min-h-0">
                <EditorPane
                  code={code}
                  onChange={(c) => updateCode(language, c)}
                  language={language}
                  theme={editorTheme}
                  settings={settings}
                  onRun={handleRun}
                />
              </div>
              <div className="border-t" />
              <div className="flex-1 min-h-0">
                <OutputPane result={result} settings={settings} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
