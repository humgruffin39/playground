"use client";

import { JavaScriptIcon, TypeScriptIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Language } from "@/types";
import { IconChevronDown } from "@tabler/icons-react";

interface LanguageSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
}

const LANGUAGES: { value: Language; label: string; icon: React.ReactNode }[] = [
  {
    value: "javascript",
    label: "JavaScript",
    icon: <JavaScriptIcon className="size-[18px]" />,
  },
  {
    value: "typescript",
    label: "TypeScript",
    icon: <TypeScriptIcon className="size-[18px]" />,
  },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const current = LANGUAGES.find((lang) => lang.value === value)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-sm">
          {current.icon}
          <span className="font-medium">{current.label}</span>
          <IconChevronDown size={14} className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => onChange(lang.value)}
            className="gap-2"
          >
            {lang.icon}
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
