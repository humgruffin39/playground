"use client";

import { useEffect, useMemo, useState } from "react";

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

export function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileDevice());
    checkMobile();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial sync with sessionStorage
    setDismissed(!!sessionStorage.getItem("mobile-warning-dismissed"));
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldShow = useMemo(
    () => isMobile && !dismissed,
    [isMobile, dismissed]
  );

  if (!shouldShow) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("mobile-warning-dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
      <div className="w-full max-w-xs border border-border bg-background p-4 shadow-lg">
        <h2 className="mb-2 text-sm font-semibold text-foreground">
          Mobile Not Supported
        </h2>
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          This playground is optimized for desktop browsers. For the best
          experience, please use a desktop or tablet device.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleDismiss}
            aria-label="Dismiss mobile warning and continue"
            className="bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity active:opacity-80"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
