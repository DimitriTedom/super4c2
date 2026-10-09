"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";

export function HeaderMicroBar() {
  const { t } = useLanguage();

  return (
    <div className="hidden border-b border-border/40 bg-muted/60 dark:bg-[#03060C] px-4 py-1.5 text-xs text-muted-foreground sm:block transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-foreground">{t("topBar_simulatorStatus")}</span>
          <span className="text-border">|</span>
          <span>{t("topBar_feiCompliance")}</span>
        </div>
        <div className="flex items-center gap-3.5 text-[11px]">
          <Link href="/blog" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            {t("topBar_blog")}
          </Link>
          <span className="text-border">|</span>
          <Link href="/communaute" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            {t("topBar_vipCommunity")}
          </Link>
          <span className="text-border">|</span>
          <span className="font-bold text-brand-crimson">{t("topBar_targetNclc")}</span>
          <span className="text-border">|</span>
          <Link
            href="/nclc-calculator"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            {t("topBar_crsCalculator")}
          </Link>
        </div>
      </div>
    </div>
  );
}
