"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  className?: string;
  threshold?: number;
}

export function ScrollToTop({ className, threshold = 280 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (scrollHeight > 0) {
        const currentProgress = Math.min(1, Math.max(0, scrollY / scrollHeight));
        setProgress(currentProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG circular progress parameters
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 15 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          title="Remonter en haut de page"
          aria-label="Remonter en haut de page"
          className={cn(
            "fixed bottom-24 right-5 sm:bottom-28 sm:right-7 z-40",
            "group flex h-11 w-11 items-center justify-center rounded-full",
            "border border-border/80 bg-card/85 backdrop-blur-md shadow-lg",
            "text-muted-foreground hover:text-foreground hover:border-primary/50 hover:shadow-xl",
            "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40",
            className
          )}
        >
          {/* Circular SVG Scroll Progress Track */}
          <svg
            className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5"
            viewBox="0 0 40 40"
          >
            {/* Background track circle */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              className="stroke-muted/40"
              strokeWidth="2.5"
              fill="transparent"
            />
            {/* Active progress circle */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              className="stroke-[#E51A31] transition-all duration-100 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Arrow Icon with micro-bounce animation */}
          <ArrowUp className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
