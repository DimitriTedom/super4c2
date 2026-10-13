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
import { signInAction, signInDemoCandidateAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
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
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const [pending, startTransition] = React.useTransition();

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <span className="text-xs text-primary hover:underline cursor-pointer">
                  Mot de passe oublié ?
                </span>
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

        {/* 1-Click Demo Candidate Access */}
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const res = await signInDemoCandidateAction(next);
                if (res.ok) {
                  toast.success("Bienvenue dans votre Espace Démo Candidat !");
                  router.push(res.redirectTo);
                  router.refresh();
                }
              });
            }}
            className="w-full h-10 rounded-xl border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-xs transition-colors"
          >
            ⚡ Connexion Démo Immédiate (Candidat Test NCLC 7)
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-2 text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">ou</span>
        </div>

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
  );
}
