"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, CheckCircle2 } from "lucide-react";

import { signUpSchema } from "@/lib/validations";
import { signUpAction } from "@/app/auth/actions";
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
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Values = z.infer<typeof signUpSchema>;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [showPassword, setShowPassword] = React.useState(false);

  // Synchronisation multi-onglets : Si l'utilisateur est déjà ou vient de se connecter
  React.useEffect(() => {
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          router.push(next);
          router.refresh();
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session?.user) {
          toast.success("Session validée ! Redirection vers votre espace...");
          router.push(next);
          router.refresh();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Ignorer si indisponible
    }
  }, [router, next]);

  const form = useForm<Values>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", displayName: "" },
  });

  const [pending, startTransition] = React.useTransition();

  const onSubmit = (values: Values) => {
    startTransition(async () => {
      const res = await signUpAction({ ...values, next });
      if (!res.ok) {
        toast.error(res.error || "Impossible de créer le compte. Veuillez vérifier vos informations.");
        return;
      }
      if ("message" in res && res.message) {
        toast.info(res.message);
      } else {
        toast.success("Compte créé avec succès ! Bienvenue sur Super4C2.");
      }
      router.push(res.redirectTo);
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
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

        {/* Display Name */}
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Prénom ou Nom d&apos;usage</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Alexandre"
                    autoComplete="name"
                    className="pl-10 h-10 rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold">Mot de passe (8 caractères minimum)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Au moins 8 caractères"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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

        {/* Guarantees */}
        <div className="space-y-1.5 py-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Accès immédiat à la Série 101 et au simulateur CBT
          </p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Calculateur de points Entrée Express NCLC 7 inclus
          </p>
        </div>

        {/* Submit */}
        <Button className="w-full font-bold h-11 rounded-xl shadow-xs text-base" type="submit" disabled={pending}>
          {pending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Création de votre compte...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Créer mon compte candidat
              <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>

        {/* Legal Consent Notice */}
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-2">
          En créant un compte, vous acceptez nos{" "}
          <Link href="/mentions-legales" className="underline hover:text-foreground">
            Conditions d&apos;Utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" className="underline hover:text-foreground">
            Politique de Confidentialité
          </Link>
          .
        </p>

        {/* Already have account */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              href={next && next !== "/dashboard" ? `/auth/login?next=${encodeURIComponent(next)}` : "/auth/login"}
              className="font-semibold text-primary hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
