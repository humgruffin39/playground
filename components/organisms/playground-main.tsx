"use client";

import { EditorPane, OutputPane } from "@/components/molecules";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { EditorTheme, ExecutionResult, Language, Settings } from "@/types";

interface PlaygroundMainProps {
  code: string;
  language: Language;
  theme: EditorTheme;
  settings: Settings;
  result: ExecutionResult | null;
  isRunning: boolean;
  mounted: boolean;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onClear: () => void;
}

export function PlaygroundMain({
  code,
  language,
  theme,
  settings,
  result,
  isRunning,
  mounted,
  onCodeChange,
  onRun,
  onClear,
}: PlaygroundMainProps) {
  const editorPane = (
    <EditorPane
      code={code}
      onChange={onCodeChange}
      language={language}
      theme={theme}
      settings={settings}
      onRun={onRun}
    />
  );

  const outputPane = (
    <OutputPane
      result={result}
      settings={settings}
      isRunning={isRunning}
      onClear={onClear}
    />
  );

  return (
    <main className="flex-1 overflow-hidden">
      {mounted ? (
        <div className="hidden h-full md:block">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={55} minSize={25}>
              {editorPane}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={45} minSize={20}>
              {outputPane}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ) : (
        <div className="hidden h-full md:block">
          <div className="flex h-full">
            <div className="flex-1" style={{ width: "55%" }}>
              {editorPane}
            </div>
            <div className="w-px bg-border" />
            <div className="flex-1" style={{ width: "45%" }}>
              {outputPane}
            </div>
          </div>
        </div>
      )}
      <div className="block h-full md:hidden">
        <div className="flex h-full flex-col">
          <div className="min-h-0 flex-1">{editorPane}</div>
          <div className="border-t" />
          <div className="min-h-0 flex-1">{outputPane}</div>
        </div>
      </div>
    </main>
  );
}

