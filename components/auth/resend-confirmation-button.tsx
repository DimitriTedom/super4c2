"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

import { resendConfirmationAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

const COOLDOWN_SECONDS = 60;

export function ResendConfirmationButton({
  email,
  next,
}: {
  email: string;
  next?: string;
}) {
  const [pending, setPending] = React.useState(false);
  const [remaining, setRemaining] = React.useState(0);

  React.useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining]);

  const handleClick = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Saisissez d'abord votre adresse e-mail dans le champ ci-dessous.");
      return;
    }
    setPending(true);
    try {
      const res = await resendConfirmationAction(email, next);
      if (res.ok) {
        toast.success(res.message);
        setRemaining(COOLDOWN_SECONDS);
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={pending || remaining > 0}
      className="h-8 rounded-lg text-xs gap-1.5"
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
      {remaining > 0 ? `Renvoyer dans ${remaining} s` : "Renvoyer l'e-mail de confirmation"}
    </Button>
  );
}
