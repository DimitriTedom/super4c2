"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopBodyLoaderProps {
  className?: string;
}

function TopBodyLoaderInner({ className }: TopBodyLoaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Trigger loading effect on route changes
  useEffect(() => {
    setLoading(true);
    setProgress(30);

    const timer1 = setTimeout(() => {
      setProgress(75);
    }, 120);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 280);

    const timer3 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname, searchParams]);

  // Global event listener for custom async loading triggers
  useEffect(() => {
    const handleCustomLoading = (e: Event) => {
      const customEvent = e as CustomEvent<{ loading: boolean }>;
      if (customEvent.detail?.loading) {
        setLoading(true);
        setProgress(65);
      } else {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 300);
      }
    };

    window.addEventListener("super4c2:loading", handleCustomLoading);
    return () => {
      window.removeEventListener("super4c2:loading", handleCustomLoading);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn("fixed top-0 left-0 right-0 z-[110] h-[3px] pointer-events-none", className)}
        >
          {/* Progress bar line */}
          <motion.div
            className="h-full bg-gradient-to-r from-[#E51A31] via-[#FF5E62] to-[#3B82F6] shadow-[0_0_12px_rgba(229,26,49,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.25 }}
          />
          {/* Head glow dot */}
          <motion.div
            className="absolute top-0 right-0 h-[3px] w-8 bg-white/80 blur-xs"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TopBodyLoader(props: TopBodyLoaderProps) {
  return (
    <Suspense fallback={null}>
      <TopBodyLoaderInner {...props} />
    </Suspense>
  );
}

