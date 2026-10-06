import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/** Magic UI — Interactive Hover Button (rendu en <Link>, palette de marque). */
export function InteractiveHoverButton({
  href,
  children,
  className,
}: InteractiveHoverButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-block w-auto cursor-pointer overflow-hidden rounded-full bg-foreground/[0.06] px-8 py-3.5 text-center font-semibold text-foreground backdrop-blur-sm transition-colors dark:bg-white/[0.08]",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-brand-crimson transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
