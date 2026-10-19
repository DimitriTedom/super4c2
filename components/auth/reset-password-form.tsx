"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";

import { updatePasswordAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    startTransition(async () => {
      const res = await updatePasswordAction(password);
      if (!res.ok) {
        setError(res.error || "Impossible de mettre à jour le mot de passe.");
        return;
      }
      toast.success(res.message);
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="new-password" className="text-xs font-semibold">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="new-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Au moins 8 caractères"
            className="pl-10 pr-10 h-10 rounded-xl"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="text-xs font-semibold">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirm-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Répétez le mot de passe"
            className="pl-10 h-10 rounded-xl"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full font-bold h-11 rounded-xl text-base">
        {pending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <span className="flex items-center gap-2">
            Mettre à jour mon mot de passe
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
