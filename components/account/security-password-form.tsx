"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePasswordAction } from "@/app/auth/actions";

export function SecurityPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updatePasswordAction(newPassword);
      if (res.ok) {
        setSuccessMsg(res.message);
        toast.success(res.message);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMsg(res.error || "Impossible de mettre à jour le mot de passe.");
        toast.error(res.error || "Erreur de mise à jour.");
      }
    } catch {
      setErrorMsg("Une erreur inattendue est survenue.");
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border bg-card p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Sécurité du Compte
          </span>
          <h2 className="font-display text-xl font-bold text-foreground">
            Modification du Mot de Passe
          </h2>
          <p className="text-xs text-muted-foreground">
            Définissez un nouveau mot de passe robuste pour protéger vos progrès et résultats.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-600 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 border border-destructive/30 px-3.5 py-2 text-xs font-semibold text-destructive animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Nouveau mot de passe */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>Nouveau mot de passe</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="•••••••• (8 caractères min.)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-3.5 pr-10 h-10 rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-2.5 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirmation */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>Confirmer le mot de passe</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-3.5 pr-10 h-10 rounded-xl"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-muted-foreground">
          Votre mot de passe doit comporter au moins 8 caractères.
        </span>

        <Button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="gap-2 font-semibold shadow-xs"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Mise à jour...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Mettre à jour mon mot de passe</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
