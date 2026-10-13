"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, ShieldCheck, Check, Settings2, X, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_STORAGE_KEY = "super4c2_cookie_consent_v1";
const CONSENT_COOKIE_KEY = "super4c2-consent-state";

export interface CookiePreferences {
  essential: true;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: true,
  timestamp: new Date().toISOString(),
};

export function CookieConsentBanner() {
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  const [preferences, setPreferences] = React.useState<CookiePreferences>(DEFAULT_PREFERENCES);

  React.useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      } else {
        // Déclencher après un court délai pour ne pas brusquer l'arrivée
        const timer = setTimeout(() => setIsOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  // Écoute de l'événement de réouverture depuis le Footer ou la page /cookies
  React.useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setShowDetails(true);
    };

    window.addEventListener("super4c2:open_cookie_preferences", handleOpen);
    return () => window.removeEventListener("super4c2:open_cookie_preferences", handleOpen);
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
      // Miroir en cookie Lax de 180 jours pour conformité SSR
      const maxAge = 60 * 60 * 24 * 180;
      document.cookie = `${CONSENT_COOKIE_KEY}=${prefs.functional && prefs.analytics ? "all" : "custom"}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } catch (err) {
      console.warn("Impossible de sauvegarder les cookies de consentement", err);
    }
    setPreferences(prefs);
    setIsOpen(false);
    setShowDetails(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString(),
    });
  };

  const pathname = usePathname();
  const isExcluded =
    /^\/examens\/[^/]+\/(ce|co|ee|eo|examen-blanc)\/?$/.test(pathname || "") ||
    pathname?.startsWith("/auth") ||
    pathname === "/admin/login";

  if (!mounted || !isOpen || isExcluded) return null;

  return (
    <aside
      aria-label="Consentement relatif aux cookies et à la vie privée"
      className="fixed bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 max-w-3xl mx-auto z-[999] animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-background/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6 text-foreground space-y-4 ring-1 ring-black/5 dark:ring-white/10">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-crimson/10 text-brand-crimson ring-1 ring-brand-crimson/20">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base leading-tight">
                Respect de votre vie privée &amp; Cookies
              </h3>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Conforme RGPD, Loi 25 (Québec) &amp; PIPEDA (Canada)</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
            title="Refuser les cookies non essentiels et fermer"
            aria-label="Fermer et refuser"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message d'explication */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Super4C2 utilise des traceurs essentiels pour sécuriser votre session d&apos;authentification et maintenir le chronomètre officiel de l&apos;examen CBT. Avec votre accord, nous activons aussi la mémorisation de votre Carnet d&apos;Erreurs SRS et les mesures de latence IA. Aucun cookie publicitaire tiers n&apos;est utilisé.
        </p>

        {/* Panneau de personnalisation dépliable */}
        {showDetails && (
          <div className="space-y-3 pt-2 border-t border-border/60 animate-in fade-in duration-200">
            {/* 1. Strictement nécessaires */}
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">1. Strictement Nécessaires</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.2 text-[10px] font-semibold border border-emerald-500/30">
                    <Lock className="h-2.5 w-2.5" /> Obligatoire
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Session Supabase Auth, persistance des réponses de l&apos;examen CBT en cours et mémorisation du consentement.
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="h-4 w-4 rounded accent-brand-crimson opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            {/* 2. Fonctionnels & Répétition Espacée */}
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card p-3">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">2. Fonctionnels &amp; Carnet d&apos;Erreurs SRS</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Recommandé</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Mémorisation locale de vos cartes SuperMemo-2 (Ebbinghaus), vitesse de lecture audio CO (0.8x-1.2x) et thème d&apos;affichage.
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  id="consent-functional"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="h-4 w-4 rounded accent-brand-crimson cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Performance & Latence IA */}
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card p-3">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">3. Télémétrie de Performance IA</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Anonyme</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Mesure des temps de réponse de la correction instantanée FEI (DeepSeek) et de la voix studio ElevenLabs pour optimiser l&apos;infrastructure.
                </p>
              </div>
              <div className="pt-1">
                <input
                  type="checkbox"
                  id="consent-analytics"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="h-4 w-4 rounded accent-brand-crimson cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Barre d'action */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <Settings2 className="h-3.5 w-3.5 text-brand-crimson" />
              <span>{showDetails ? "Masquer les détails" : "Personnaliser mes choix"}</span>
              {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <Link
              href="/cookies"
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
            >
              Politique des cookies
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {showDetails ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveCustom}
                className="text-xs font-semibold h-9 rounded-xl flex-1 sm:flex-initial"
              >
                Enregistrer mes choix
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRejectNonEssential}
                className="text-xs font-semibold h-9 rounded-xl flex-1 sm:flex-initial"
              >
                Refuser non-essentiels
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm flex-1 sm:flex-initial"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Tout accepter
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
