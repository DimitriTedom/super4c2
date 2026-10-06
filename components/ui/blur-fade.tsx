"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  inView?: boolean;
  blur?: string;
}

/** Magic UI — Blur Fade (framer-motion). `inView` déclenche l'animation au scroll. */
export function BlurFade({
  children,
  className,
  duration = 0.5,
  delay = 0,
  offset = 14,
  direction = "up",
  inView = false,
  blur = "8px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: "-60px" });
  const isInView = !inView || inViewResult;
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "right" || direction === "down" ? -offset : offset;

  const variants: Variants = {
    hidden: { [axis]: sign, opacity: 0, filter: `blur(${blur})` },
    visible: { [axis]: 0, opacity: 1, filter: "blur(0px)" },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
