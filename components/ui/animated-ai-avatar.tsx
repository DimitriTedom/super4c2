"use client";

import React from "react";
import Image from "next/image";
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
  const sizeDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none shrink-0",
        sizeDimensions[size],
        className
      )}
    >
      {/* Outer ambient energy ring when speaking */}
      {isSpeaking && (
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.6, 0.15, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-red-500/30 to-rose-500/50 blur-sm pointer-events-none"
        />
      )}

      {/* Floating shell with 3D Orb */}
      <motion.div
        animate={
          isThinking
            ? { rotate: [0, 8, -8, 0], y: [0, -3, 0] }
            : { y: [0, -2.5, 0] }
        }
        transition={{
          duration: isThinking ? 2 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <Image
          src="/brand/icons-3d/ai-assistant-orb.png"
          alt="Aura C2 AI Avatar"
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none"
          priority
        />
      </motion.div>
    </div>
  );
}
