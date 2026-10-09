"use client";

import { motion, useScroll, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  className?: string;
}

export function ScrollProgress({ className, ...props }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-[#E51A31] via-[#FF5E62] to-[#3B82F6] pointer-events-none shadow-[0_0_10px_rgba(229,26,49,0.7)]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  );
}
