"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full opacity-0">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = (theme === "dark" || resolvedTheme === "dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Basculer le thème"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200" />
      )}
    </Button>
  );
}
