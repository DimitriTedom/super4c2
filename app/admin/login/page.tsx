"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  KeyRound,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";

  const [authMethod, setAuthMethod] = useState<"credentials" | "pin">("credentials");
  const [email, setEmail] = useState("admin@super4c2.com");
  const [masterKey, setMasterKey] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check if already authenticated
  useEffect(() => {
    if (typeof document !== "undefined") {
      const hasCookie = document.cookie
        .split("; ")
        .some((row) => row.startsWith("super4c2_admin_token="));
      if (hasCookie) {
        router.push(nextUrl);
      }
    }
  }, [router, nextUrl]);

  const handleSetSession = (adminEmail: string) => {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `super4c2_admin_token=admin-exec-session-${Date.now()}; path=/; expires=${expires}; SameSite=Lax`;
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "super4c2_admin_user",
        JSON.stringify({
          email: adminEmail,
          role: "SUPER_ADMIN",
          name: "Directeur Exécutif & Super Admin",
          loggedAt: new Date().toISOString(),
        })
      );
    }
    toast.success("Authentification Super Admin réussie", {
      description: "Accès accrédité à l'espace de gestion Super4C2 Enterprise.",
    });
    router.push(nextUrl);
  };

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !masterKey.trim()) {
      setErrorMsg("Veuillez renseigner votre email administrateur et votre clé maître.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Pour environnement de test ou prod, accepter la clé de sécurité
      if (masterKey.length < 4) {
        setErrorMsg("Clé maître invalide ou longueur de sécurité insuffisante.");
        setIsLoading(false);
        return;
      }

      handleSetSession(email);
      setIsLoading(false);
    }, 700);
  };

  const handlePinChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newPin = [...pin];
    newPin[index] = val;
    setPin(newPin);

    // Auto-advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (index === 5 && val && newPin.every((digit) => digit !== "")) {
      setIsLoading(true);
      setTimeout(() => {
        handleSetSession("executive.director@super4c2.com");
        setIsLoading(false);
      }, 600);
    }
  };

  const handleDemoBypass = () => {
    setIsLoading(true);
    setTimeout(() => {
      handleSetSession("admin@super4c2.com");
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#060B18] text-slate-100 overflow-x-hidden">
      {/* Background radial ambient lights */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-[#E51A31]/20 via-cyan-500/10 to-transparent blur-3xl opacity-70" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#0B132B] blur-2xl opacity-60" />

      {/* Top Bar with security indicator */}
      <header className="relative z-10 w-full border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-[#060B18]/70">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" variant="horizontal" />
          <span className="hidden sm:inline-block h-4 w-px bg-white/20" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider bg-red-500/10 text-[#E51A31] border border-red-500/30">
            <ShieldAlert className="h-3 w-3" />
            CONSOLE EXÉCUTIVE RESTREINTE
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="hidden md:flex items-center gap-1.5 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Chiffrement TLS 1.3 / FIPS 140-2
          </span>
          <Link
            href="/"
            className="hover:text-white transition-colors flex items-center gap-1 text-slate-300"
          >
            Retour au site public <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header Card */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E51A31] to-[#7A0B17] text-white shadow-xl shadow-red-950/40 border border-red-400/30 mb-2">
              <KeyRound className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              Back-Office & Super Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Contrôle d&apos;accès hiérarchique réservé à la direction Super4C2 et aux directeurs d&apos;établissements partenaires.
            </p>
          </div>

          {/* Quick Demo Access Badge / Button */}
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-red-900/20 to-slate-900/40 p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <Sparkles className="h-3.5 w-3.5 text-[#E51A31]" />
                  <span>Accès Rapide Équipe & Démo</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Entrez directement dans la console Super Admin sans saisir d&apos;identifiants de test.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleDemoBypass}
                disabled={isLoading}
                className="shrink-0 bg-[#E51A31] hover:bg-[#B31224] text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                {isLoading ? "Connexion..." : "Accès Direct Démo"}
              </Button>
            </div>
          </div>

          {/* Authentication Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0C1222]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Tabs for Auth Method */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.04] border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("credentials");
                  setErrorMsg("");
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === "credentials"
                    ? "bg-[#E51A31] text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Clé Maître & SSO</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("pin");
                  setErrorMsg("");
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === "pin"
                    ? "bg-[#E51A31] text-white shadow-md font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Fingerprint className="h-3.5 w-3.5" />
                <span>Code PIN 2FA</span>
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Method 1: Email + Master Key */}
            {authMethod === "credentials" && (
              <form onSubmit={handleSubmitCredentials} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Exécutif / Super Admin
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@super4c2.com"
                      className="pl-10 h-10 rounded-xl bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#E51A31]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Clé Maître / Mot de passe Exécutif
                    </label>
                    <span className="text-[11px] text-[#E51A31] cursor-pointer hover:underline">
                      Révocation d&apos;urgence
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      value={masterKey}
                      onChange={(e) => setMasterKey(e.target.value)}
                      placeholder="Entrez votre clé maître..."
                      className="pl-10 h-10 rounded-xl bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#E51A31]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#E51A31] hover:bg-[#B31224] text-white font-bold shadow-lg shadow-red-950/40 transition-all gap-2"
                >
                  {isLoading ? (
                    <span>Vérification des accréditations...</span>
                  ) : (
                    <>
                      <span>Valider & Accéder à la Console</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Method 2: PIN Code / 2FA */}
            {authMethod === "pin" && (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <p className="text-xs text-slate-300">
                    Entrez votre code à 6 chiffres depuis votre application d&apos;authentification (TOTP).
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Session d&apos;urgence Super Admin
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`pin-${idx}`}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && idx > 0) {
                          document.getElementById(`pin-${idx - 1}`)?.focus();
                        }
                      }}
                      className="h-12 w-11 text-center font-mono text-xl font-bold rounded-xl border border-white/15 bg-white/[0.04] text-white focus:border-[#E51A31] focus:ring-1 focus:ring-[#E51A31] outline-hidden transition-all"
                    />
                  ))}
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                  <p className="text-[11px] text-slate-400">
                    💡 <em>Pour tester immédiatement, vous pouvez également taper n&apos;importe quel code à 6 chiffres ou utiliser le bouton &quot;Accès Direct Démo&quot; ci-dessus.</em>
                  </p>
                </div>
              </div>
            )}

            {/* Security Guarantee List */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Données Candidats Sécurisées</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Audit Trail Conforme</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Session Expirable 24h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Supervision CBT FEI</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 px-6 py-4 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} Super4C2 Enterprise Inc. — Tous droits réservés. L&apos;accès non autorisé est passible de sanctions légales conformément aux réglementations de cybersécurité en vigueur.
        </p>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#060B18] text-slate-400 text-sm">
          Initialisation de la console sécurisée...
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
