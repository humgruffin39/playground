"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconHelp } from "@tabler/icons-react";

const SHORTCUTS = [
  { keys: ["Ctrl", "Enter"], description: "Run code" },
  { keys: ["Ctrl", "/"], description: "Toggle comment" },
  { keys: ["Tab"], description: "Indent" },
  { keys: ["Shift", "Tab"], description: "Outdent" },
  { keys: ["?"], description: "Show this help" },
  { keys: ["Esc"], description: "Close dialog" },
];

export function KeyboardHelp() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Keyboard shortcuts"
          className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          title="Keyboard shortcuts (?)"
        >
          <IconHelp size={18} stroke={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="space-y-4">
            <span className="text-xs font-medium">Keyboard Shortcuts</span>
          <div className="space-y-2">
            {SHORTCUTS.map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {shortcut.description}
                </span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, j) => (
                    <kbd
                      key={j}
                      className="min-w-[24px] bg-muted px-1.5 py-0.5 text-center text-[10px] font-medium text-foreground"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground/70">
            On macOS, use ⌘ instead of Ctrl
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
