"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { toast } from "sonner";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  sub: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: "fr",
    name: "Français",
    nativeName: "Français (Canada)",
    flag: "🇨🇦",
    sub: "Langue officielle TCF & TEF",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English (Canada)",
    flag: "🇬🇧",
    sub: "IRCC Express Entry / CLB",
  },
  {
    code: "es",
    name: "Español",
    nativeName: "Español",
    flag: "🇪🇸",
    sub: "Candidatos TCF Latinoamérica",
  },
  {
    code: "ar",
    name: "العربية",
    nativeName: "العربية",
    flag: "🇸🇦",
    sub: "مرشحو الهجرة إلى كندا",
  },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [currentLang, setCurrentLang] = useState<string>("fr");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read saved locale or default to fr
    const saved = localStorage.getItem("super4c2_lang");
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setCurrentLang(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const selectLanguage = (code: string) => {
    const selected = LANGUAGES.find((l) => l.code === code);
    if (!selected) return;

    setCurrentLang(code);
    localStorage.setItem("super4c2_lang", code);
    document.cookie = `super4c2_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = code;
    setOpen(false);

    toast.success(`Langue active : ${selected.nativeName}`, {
      description: selected.sub,
    });
  };

  const activeLang = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-2.5 py-1 text-xs font-semibold text-foreground/80 hover:bg-muted/80 hover:text-foreground transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-primary/40"
        aria-label="Changer de langue"
        aria-expanded={open}
      >
        <span className="text-sm">{activeLang.flag}</span>
        <span className="font-mono text-[11px] uppercase tracking-wide">
          {activeLang.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-9 z-50 w-64 rounded-2xl border border-border/80 bg-popover/95 p-2 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-border/40 text-[11px] text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span>Sélectionner la langue</span>
          </div>

          <div className="py-1 space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => selectLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div>
                      <p className="font-medium leading-tight">{lang.nativeName}</p>
                      <p className="text-[10px] text-muted-foreground">{lang.sub}</p>
                    </div>
                  </div>

                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-border/40 px-2.5 pt-2 pb-1 text-[10px] text-muted-foreground leading-tight">
            <span>Préférence enregistrée pour votre profil candidat.</span>
          </div>
        </div>
      )}
    </div>
  );
}
