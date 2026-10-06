import React, { type CSSProperties } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

/**
 * Magic UI — Shimmer Button (adapté Tailwind v3).
 * Si `href` est fourni, le composant est rendu comme un <Link> Next.js (HTML valide).
 */
export function ShimmerButton({
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  shimmerDuration = "3s",
  borderRadius = "100px",
  background = "rgba(0, 0, 0, 1)",
  className,
  children,
  href,
}: ShimmerButtonProps) {
  const classes = cn(
    "group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] px-7 py-3.5 whitespace-nowrap text-white [background:var(--bg)]",
    "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px hover:scale-[1.02]",
    className,
  );

  const style = {
    "--spread": "90deg",
    "--shimmer-color": shimmerColor,
    "--radius": borderRadius,
    "--speed": shimmerDuration,
    "--cut": shimmerSize,
    "--bg": background,
  } as CSSProperties;

  const inner = (
    <>
      {/* spark container */}
      <div className="-z-30 blur-[2px] [container-type:size] absolute inset-0 overflow-visible">
        <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>

      {children}

      {/* highlight */}
      <div className="absolute inset-0 size-full rounded-2xl shadow-[inset_0_-8px_10px_#ffffff1f] transform-gpu transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />

      {/* backdrop */}
      <div className="absolute inset-[var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
    </>
  );

  if (href) {
    return (
      <Link href={href} style={style} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" style={style} className={classes}>
      {inner}
    </button>
  );
}
