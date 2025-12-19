"use client";

import type { Language } from "@/types";
import { IconCheck, IconLink } from "@tabler/icons-react";
import { useCallback, useState } from "react";

interface ShareButtonProps {
  code: string;
  language: Language;
}

function encodeCode(code: string): string {
  try {
    const bytes = new TextEncoder().encode(code);
    const binary = String.fromCharCode(...bytes);
    return btoa(binary);
  } catch {
    return encodeURIComponent(code);
  }
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

export function ShareButton({ code, language }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("lang", language);
    params.set("code", encodeCode(code));
    const url = `${window.location.origin}${
      window.location.pathname
    }?${params.toString()}`;
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code, language]);

  return (
    <button
      onClick={handleShare}
      aria-label="Share code"
      className="flex shrink-0 items-center justify-center gap-1 bg-primary px-2 py-1 text-[11px] font-medium leading-none text-primary-foreground transition-opacity hover:opacity-90"
    >
      {copied ? (
        <IconCheck size={14} stroke={2} className="flex-shrink-0" />
      ) : (
        <IconLink size={14} stroke={2} className="flex-shrink-0" />
      )}
      <span className="mt-0.5 whitespace-nowrap leading-none">Share</span>
    </button>
  );
}
