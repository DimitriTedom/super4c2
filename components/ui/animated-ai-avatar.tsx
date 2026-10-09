"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedAiAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isSpeaking?: boolean;
  isThinking?: boolean;
}

export function AnimatedAiAvatar({
  size = "md",
  className,
  isSpeaking = false,
  isThinking = false,
}: AnimatedAiAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Natural blinking effect every 3.2 to 5 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleBlink = () => {
      const nextBlink = Math.random() * 2500 + 3000;
      timeoutId = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 180);
      }, nextBlink);
    };

    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  const sizeDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const eyeDimensions = {
    sm: { w: 4, h: 6, r: 2 },
    md: { w: 6, h: 9, r: 3 },
    lg: { w: 8, h: 12, r: 4 },
    xl: { w: 10, h: 16, r: 5 },
  };

  const currentEye = eyeDimensions[size];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none shrink-0",
        sizeDimensions[size],
        className
      )}
    >
      {/* Outer ambient energy ring when speaking or active */}
      {isSpeaking && (
        <motion.div
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.6, 0.1, 0.6],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-red-500/30 to-rose-500/50 blur-sm pointer-events-none"
        />
      )}

      {/* Outer floating shell */}
      <motion.div
        animate={
          isThinking
            ? { rotate: 360 }
            : {
                y: [0, -2, 0],
              }
        }
        transition={
          isThinking
            ? { duration: 6, repeat: Infinity, ease: "linear" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative w-full h-full rounded-2xl sm:rounded-3xl p-[1.5px] bg-gradient-to-b from-red-500 via-rose-600 to-slate-900 shadow-md shadow-red-500/20 flex items-center justify-center overflow-hidden"
      >
        {/* Glossy sphere body */}
        <div className="relative w-full h-full rounded-[inherit] bg-gradient-to-b from-rose-950/90 via-slate-950 to-black flex items-center justify-center overflow-hidden">
          {/* Top specular highlight */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-[inherit]" />

          {/* Cyan visor background glow */}
          <div
            className={cn(
              "absolute inset-1 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center transition-all",
              isSpeaking && "bg-cyan-900/50 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            )}
          >
            {/* Digital Eyes Display */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Left Eye */}
              <motion.div
                animate={{
                  scaleY: isBlinking ? 0.1 : isSpeaking ? [1, 1.2, 0.9, 1.1] : 1,
                  scaleX: isSpeaking ? [1, 0.9, 1.1, 1] : 1,
                }}
                transition={{
                  duration: isBlinking ? 0.15 : 0.8,
                  repeat: isSpeaking ? Infinity : 0,
                }}
                style={{
                  width: `${currentEye.w}px`,
                  height: `${currentEye.h}px`,
                  borderRadius: `${currentEye.r}px`,
                }}
                className="bg-cyan-400 shadow-[0_0_8px_#22d3ee,0_0_14px_#06b6d4] transition-all"
              />

              {/* Right Eye */}
              <motion.div
                animate={{
                  scaleY: isBlinking ? 0.1 : isSpeaking ? [1, 1.2, 0.9, 1.1] : 1,
                  scaleX: isSpeaking ? [1, 0.9, 1.1, 1] : 1,
                }}
                transition={{
                  duration: isBlinking ? 0.15 : 0.8,
                  repeat: isSpeaking ? Infinity : 0,
                }}
                style={{
                  width: `${currentEye.w}px`,
                  height: `${currentEye.h}px`,
                  borderRadius: `${currentEye.r}px`,
                }}
                className="bg-cyan-400 shadow-[0_0_8px_#22d3ee,0_0_14px_#06b6d4] transition-all"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
