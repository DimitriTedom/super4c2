"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";

import { signInSchema } from "@/lib/validations";
import { signInAction, resetPasswordForEmailAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Values = z.infer<typeof signInSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const isPendingConfirmation = searchParams.get("registered") === "pending_confirmation";
  const [showPassword, setShowPassword] = React.useState(false);
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetPending, setResetPending] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const [pending, startTransition] = React.useTransition();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes("@")) {
      toast.error("Veuillez renseigner une adresse e-mail valide.");
      return;
    }
    setResetPending(true);
    try {
      const res = await resetPasswordForEmailAction(resetEmail);
      if (res.ok) {
        toast.success(res.message);
        setResetDialogOpen(false);
      } else {
        toast.error(res.error || "Impossible d'envoyer l'e-mail de réinitialisation.");
      }
    } catch {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setResetPending(false);
    }
  };

  const onSubmit = (values: Values) => {
    startTransition(async () => {
      const res = await signInAction({ ...values, next });
      if (!res.ok) {
        toast.error(res.error || "Identifiants invalides. Veuillez réessayer.");
        return;
      }
      toast.success("Ravi de vous revoir sur Super4C2 !");
      router.push(res.redirectTo);
      router.refresh();
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Bandeau d'invitation à valider le lien dans la boîte mail */}
        {isPendingConfirmation && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 shadow-xs">
            <p className="font-bold text-sm flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Mail className="h-4 w-4 shrink-0" />
              Lien de confirmation envoyé !
            </p>
            <p className="leading-relaxed">
              Votre compte a été créé avec succès. Veuillez ouvrir l&apos;e-mail reçu et cliquer sur le lien de confirmation avant de vous connecter.
            </p>
          </div>
        )}

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Adresse e-mail</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="candidat@canada.ca"
                    type="email"
                    autoComplete="email"
                    className="pl-10 h-10 rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold">Mot de passe</FormLabel>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(form.getValues("email") || "");
                    setResetDialogOpen(true);
                  }}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pl-10 pr-10 h-10 rounded-xl"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button className="w-full font-bold h-11 rounded-xl shadow-xs text-base" type="submit" disabled={pending}>
          {pending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Connexion en cours...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Se connecter à mon espace
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>


        {/* Create Account Link */}
        <div className="text-center pt-1 space-y-2">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href={next && next !== "/dashboard" ? `/auth/register?next=${encodeURIComponent(next)}` : "/auth/register"}
              className="font-semibold text-primary hover:underline"
            >
              Créer mon compte gratuitement
            </Link>
          </p>
          <div className="pt-2 border-t border-border/50">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-primary" />
              <span>Accès Espace Direction & Super Admin</span>
            </Link>
          </div>
        </div>
      </form>
    </Form>

    <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-display text-xl font-bold">
            Réinitialisation du mot de passe
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Indiquez l&apos;adresse e-mail associée à votre compte Super4C2. Nous vous enverrons immédiatement un lien sécurisé pour définir un nouveau mot de passe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Adresse e-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="pl-10 h-10 rounded-xl"
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setResetDialogOpen(false)}
              className="h-10 rounded-xl text-xs"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={resetPending}
              className="h-10 rounded-xl font-semibold text-xs gap-2"
            >
              {resetPending ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
