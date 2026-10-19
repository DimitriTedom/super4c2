"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function AuthDivider({ label = "ou" }: { label?: string }) {
  return (
    <div className="relative flex items-center py-1" role="separator">
      <div className="flex-1 border-t border-border/60" />
      <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex-1 border-t border-border/60" />
    </div>
  );
}

export function GoogleButton({ next = "/dashboard", label = "Continuer avec Google" }: { next?: string; label?: string }) {
  const [pending, setPending] = React.useState(false);

  const handleClick = async () => {
    setPending(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) {
        toast.error(
          error.message.toLowerCase().includes("not enabled") || error.message.toLowerCase().includes("unsupported provider")
            ? "La connexion Google n'est pas encore activée. Utilisez votre e-mail pour le moment."
            : error.message
        );
        setPending(false);
      }
      // En cas de succès, le navigateur est redirigé vers Google.
    } catch {
      toast.error("Impossible de démarrer la connexion Google.");
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={pending}
      className="w-full h-11 rounded-xl gap-2.5 font-semibold"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="h-4 w-4" />}
      {label}
    </Button>
  );
}
