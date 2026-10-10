"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManageCookiesButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}

export function ManageCookiesButton({
  variant = "outline",
  size = "sm",
  className,
  label = "Gérer mes préférences de cookies",
}: ManageCookiesButtonProps) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("super4c2:open_cookie_preferences"));
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      <Settings2 className="mr-2 h-4 w-4 text-brand-crimson" />
      {label}
    </Button>
  );
}
