"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OralWaveformProps {
  isRecording: boolean;
  isExaminerSpeaking: boolean;
  className?: string;
}

export function OralWaveform({
  isRecording,
  isExaminerSpeaking,
  className,
}: OralWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const active = isRecording || isExaminerSpeaking;
      const strokeColor = isExaminerSpeaking ? "#00B4D8" : isRecording ? "#E51A31" : "#94A3B8";

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = strokeColor;

      const barCount = 32;
      const step = width / barCount;

      for (let i = 0; i < barCount; i++) {
        const x = i * step + step / 2;
        let amplitude = 4;
        if (active) {
          amplitude = Math.sin(phase + i * 0.4) * (isRecording ? 18 : 24) + (Math.random() * 8);
        }

        ctx.moveTo(x, centerY - amplitude);
        ctx.lineTo(x, centerY + amplitude);
      }

      ctx.stroke();
      phase += 0.15;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isRecording, isExaminerSpeaking]);

  return (
    <div className={cn("flex flex-col items-center justify-center p-2", className)}>
      <canvas
        ref={canvasRef}
        width={320}
        height={64}
        className="w-full max-w-[320px] h-[64px]"
      />
    </div>
  );
}
