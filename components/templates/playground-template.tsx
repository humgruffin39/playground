"use client";

import { MobileWarning } from "@/components/atoms";
import { PlaygroundHeader, PlaygroundMain } from "@/components/organisms";
import {
  useCodeExecutor,
  useDebounce,
  usePersistedCode,
  useSettings,
} from "@/hooks";
import type { ExecutionResult } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export function PlaygroundTemplate() {
  const { settings, updateSettings, resetSettings, isDark } = useSettings();
  const { language, codes, updateLanguage, updateCode } = usePersistedCode();
  const { execute } = useCodeExecutor();
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  const code = codes[language];
  const debouncedCode = useDebounce(
    code,
    settings.autoRun ? settings.debounceMs : 0
  );
  const editorTheme = useMemo(
    () => (isDark ? settings.darkTheme : settings.lightTheme),
    [isDark, settings.darkTheme, settings.lightTheme]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Track mount state for hydration
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!settings.autoRun || !debouncedCode) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- UI feedback before async operation
    setIsRunning(true);

    execute(debouncedCode, language).then((res) => {
      if (!cancelled) {
        setResult(res);
        setIsRunning(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedCode, language, execute, settings.autoRun]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    execute(code, language).then((res) => {
      setResult(res);
      setIsRunning(false);
    });
  }, [code, language, execute]);

  const handleClear = useCallback(() => {
    setResult(null);
  }, []);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      updateCode(language, newCode);
    },
    [language, updateCode]
  );

  return (
    <>
      <MobileWarning />
      <div className="flex h-screen flex-col bg-background">
        <PlaygroundHeader
          language={language}
          code={code}
          settings={settings}
          isDark={isDark}
          onLanguageChange={updateLanguage}
          onSettingsChange={updateSettings}
          onSettingsReset={resetSettings}
        />
        <PlaygroundMain
          code={code}
          language={language}
          theme={editorTheme}
          settings={settings}
          result={result}
          isRunning={isRunning}
          mounted={mounted}
          onCodeChange={handleCodeChange}
          onRun={handleRun}
          onClear={handleClear}
        />
      </div>
    </>
  );
}

