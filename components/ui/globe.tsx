"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

export function Globe({
  className,
  config = {},
}: {
  className?: string;
  config?: Partial<COBEOptions>;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const pointerInteracting = useRef<number | null>(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const baseConfig: COBEOptions = {
    width: 800,
    height: 800,
    devicePixelRatio: 2,
    phi: 0,
    theta: 0.3,
    dark: isDark ? 1 : 0,
    diffuse: isDark ? 1.2 : 0.8,
    mapSamples: 16000,
    mapBrightness: isDark ? 3.5 : 0.85,
    baseColor: isDark ? [0.15, 0.2, 0.32] : [0.94, 0.96, 0.99],
    markerColor: [229 / 255, 26 / 255, 49 / 255], // Brand Crimson #E51A31
    glowColor: isDark ? [0.35, 0.45, 0.65] : [0.88, 0.92, 0.98],
    markerElevation: 0,
    markers: [
      // Canada destination hubs
      { location: [45.5017, -73.5673], size: 0.06 }, // Montréal
      { location: [43.6532, -79.3832], size: 0.06 }, // Toronto
      { location: [49.2827, -123.1207], size: 0.05 }, // Vancouver
      { location: [45.4215, -75.6972], size: 0.06 }, // Ottawa
      // Global candidate origin hubs
      { location: [48.8566, 2.3522], size: 0.05 }, // Paris, France
      { location: [3.848, 11.5021], size: 0.05 }, // Yaoundé, Cameroun
      { location: [4.0511, 9.7679], size: 0.05 }, // Douala, Cameroun
      { location: [33.5731, -7.5898], size: 0.05 }, // Casablanca, Maroc
      { location: [14.7167, -17.4677], size: 0.05 }, // Dakar, Sénégal
      { location: [36.7538, 3.0588], size: 0.05 }, // Alger, Algérie
      { location: [36.8065, 10.1815], size: 0.04 }, // Tunis, Tunisie
      { location: [5.36, -4.0083], size: 0.05 }, // Abidjan, Côte d'Ivoire
      { location: [33.8938, 35.5018], size: 0.04 }, // Beyrouth, Liban
      { location: [6.5244, 3.3792], size: 0.05 }, // Lagos, Nigeria
      { location: [50.8503, 4.3517], size: 0.04 }, // Bruxelles, Belgique
    ],
  };

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    let animationFrameId: number;
    let globe: ReturnType<typeof createGlobe> | null = null;

    if (canvasRef.current) {
      globe = createGlobe(canvasRef.current, {
        ...baseConfig,
        ...config,
        markers: (config.markers ?? baseConfig.markers)?.map((m) => ({
          ...m,
          size: m.size * 0.45,
        })),
        width: (widthRef.current * 2) || 800,
        height: (widthRef.current * 2) || 800,
      });

      const animate = () => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        if (globe) {
          globe.update({
            phi: phiRef.current + rs.get(),
            width: (widthRef.current * 2) || 800,
            height: (widthRef.current * 2) || 800,
          });
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);

      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (globe) {
        globe.destroy();
      }
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rs, isDark]);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full",
        className
      )}
    >
      <canvas
        className="size-full opacity-0 transition-opacity duration-1000 cursor-grab contain-[layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
