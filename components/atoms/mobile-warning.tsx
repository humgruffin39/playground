"use client";

import { useEffect, useState } from "react";

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
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const wasDismissed = sessionStorage.getItem("mobile-warning-dismissed");
      if (!wasDismissed) {
        setDismissed(false);
      } else {
        setDismissed(true);
      }
    }
  }, [isMobile]);

  if (!isMobile || dismissed) return null;

  return (
    <div
      className="fixed z-50 flex items-center justify-center bg-black/60"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: "12px",
      }}
    >
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
            onClick={() => {
              sessionStorage.setItem("mobile-warning-dismissed", "true");
              setDismissed(true);
            }}
            className="bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity active:opacity-80"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
