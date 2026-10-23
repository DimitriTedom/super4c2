"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  variant?: "horizontal" | "vertical" | "mark-only" | "type-only";
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  subtitleText?: string;
  href?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    markSize: 28,
    textClass: "text-lg",
    c2Class: "text-lg",
    subClass: "text-[9px] tracking-[0.18em]",
    gapClass: "gap-2",
  },
  md: {
    markSize: 36,
    textClass: "text-2xl",
    c2Class: "text-2xl",
    subClass: "text-[10px] tracking-[0.2em]",
    gapClass: "gap-3",
  },
  lg: {
    markSize: 48,
    textClass: "text-3xl",
    c2Class: "text-3xl",
    subClass: "text-xs tracking-[0.22em]",
    gapClass: "gap-3.5",
  },
  xl: {
    markSize: 64,
    textClass: "text-5xl",
    c2Class: "text-5xl",
    subClass: "text-sm tracking-[0.25em]",
    gapClass: "gap-4",
  },
};

export function BrandLogo({
  variant = "horizontal",
  size = "md",
  showSubtitle = true,
  subtitleText = "TCF & TEF CANADA PREP",
  href = "/",
  forceDark = false,
  className,
}: BrandLogoProps & { forceDark?: boolean }) {
  const config = sizeConfig[size];

  const logomark = (
    <div
      className={cn(
        "relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
        variant === "vertical" && "mx-auto mb-1.5"
      )}
      style={{ width: config.markSize, height: config.markSize }}
    >
      <Image
        src="/brand/Le Logomark.png"
        alt="Super4C2 Logomark"
        width={config.markSize}
        height={config.markSize}
        className="h-full w-full object-contain drop-shadow-sm"
        priority
      />
    </div>
  );

  const wordmark = (
    <div className={cn("flex flex-col leading-none", variant === "vertical" && "items-center text-center")}>
      <div className={cn("font-display font-black tracking-[-0.03em] select-none flex items-baseline", config.textClass)}>
        {/* SUPER4 : Navy en mode clair, Blanc en mode sombre ou si forceDark */}
        <span
          className={cn(
            "transition-colors duration-200",
            forceDark ? "text-white" : "text-[#0B132B] dark:text-white"
          )}
        >
          SUPER4
        </span>
        {/* C2 : Maple Crimson distinctif */}
        <span className="text-[#E51A31] ml-[1px] font-black drop-shadow-[0_1px_8px_rgba(229,26,49,0.25)]">
          C2
        </span>
      </div>

      {showSubtitle && variant !== "type-only" && (
        <span
          className={cn(
            "font-body font-semibold uppercase mt-1 select-none",
            forceDark ? "text-slate-300" : "text-slate-500 dark:text-slate-400",
            config.subClass
          )}
        >
          {subtitleText}
        </span>
      )}
    </div>
  );

  const content = (
    <div
      className={cn(
        "group inline-flex items-center select-none",
        variant === "vertical" ? "flex-col text-center" : "flex-row",
        config.gapClass,
        className
      )}
    >
      {variant !== "type-only" && logomark}
      {variant !== "mark-only" && wordmark}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E51A31] rounded-md">
        {content}
      </Link>
    );
  }

  return content;
}
