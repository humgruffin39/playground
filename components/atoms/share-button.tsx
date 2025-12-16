"use client";

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
      className="ml-1 w-14 bg-primary py-1 text-center text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
