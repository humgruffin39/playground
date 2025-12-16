"use client";

import { IconCheck, IconLink } from "@tabler/icons-react";
import { useCallback, useState } from "react";

interface ShareButtonProps {
  getShareUrl: () => string;
}

export function ShareButton({ getShareUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = getShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [getShareUrl]);

  return (
    <button
      onClick={handleShare}
      className="flex shrink-0 items-center justify-center gap-1 bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >
      {copied ? (
        <IconCheck size={14} stroke={2} />
      ) : (
        <IconLink size={14} stroke={2} />
      )}
      <span className="whitespace-nowrap">Share</span>
    </button>
  );
}
