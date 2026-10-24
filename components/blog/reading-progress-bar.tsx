"use client";

import React, { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight === 0) return;
      const scrollPercentage = Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100));
      setProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-crimson via-amber-500 to-emerald-500 transition-all duration-75 ease-out shadow-sm"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
