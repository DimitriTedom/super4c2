"use client";

import React, { useState, useEffect, useMemo, Suspense, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  FolderKanban,
  CircleHelp,
  MessageSquareQuote,
  Mail,
  Users,
  ChevronRight,
  SlidersHorizontal,
  LogOut,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { removeToastQuery } from "@/lib/toast-navigation";

interface AdminShellProps {
  children: ReactNode;
}

const navItems = [
  {
    group: "Supervision",
    links: [
      { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
    ],
  },
  {
    group: "Épreuves CBT (MVP)",
    links: [
      { href: "/admin/series-ce", label: "Séries Compréhension Écrite", icon: BookOpen },
      { href: "/admin/series-ee", label: "Séries Expression Écrite", icon: PenTool },
    ],
  },
  {
    group: "Marketing & Acquisition",
    links: [
      { href: "/admin/blog", label: "Blog & Guides SEO", icon: FolderKanban },
      { href: "/admin/faqs", label: "Questions Fréquentes (FAQs)", icon: CircleHelp },
      { href: "/admin/temoignages", label: "Témoignages Candidats", icon: MessageSquareQuote },
      { href: "/admin/newsletter", label: "Abonnés Newsletter", icon: Mail },
      { href: "/admin/leads", label: "Demandes & Conciergerie", icon: Users },
    ],
  },
];

function ToastQueryListener() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const hasToast = searchParams.get("__toast");
    if (hasToast) {
      const message = searchParams.get("toastMessage") || "Opération effectuée.";
      const title = searchParams.get("toastTitle");
      const variant = searchParams.get("toastVariant") || "success";

      if (variant === "error") {
        toast.error(title || "Erreur", { description: message });
      } else if (variant === "warning") {
        toast.warning(title || "Attention", { description: message });
      } else {
        toast.success(title || "Succès", { description: message });
      }

      // Nettoyer l'URL sans recharger
      const cleanParams = removeToastQuery(new URLSearchParams(searchParams.toString()));
      const cleanQuery = cleanParams.toString();
      const newPath = cleanQuery ? `${pathname}?${cleanQuery}` : pathname;
      router.replace(newPath, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAdminLogout = () => {
    document.cookie = "super4c2_admin_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (typeof window !== "undefined") {
      localStorage.removeItem("super4c2_admin_user");
    }
    toast.info("Déconnexion réussie", {
      description: "Vous avez quitté l'espace d'administration sécurisé.",
    });
    router.push("/admin/login");
  };

  // Calcul du titre et fil d'Ariane
  const breadcrumbInfo = useMemo(() => {
    if (pathname === "/admin") return { title: "Tableau de Bord Exécutif", section: "Supervision" };
    if (pathname.startsWith("/admin/series-ce")) return { title: "Compréhension Écrite", section: "Épreuves CBT" };
    if (pathname.startsWith("/admin/series-ee")) return { title: "Expression Écrite", section: "Épreuves CBT" };
    if (pathname.startsWith("/admin/blog")) return { title: "Blog & SEO", section: "Marketing" };
    if (pathname.startsWith("/admin/faqs")) return { title: "FAQs", section: "Contenu" };
    if (pathname.startsWith("/admin/temoignages")) return { title: "Témoignages", section: "Marketing" };
    if (pathname.startsWith("/admin/newsletter")) return { title: "Newsletter", section: "Marketing" };
    if (pathname.startsWith("/admin/leads")) return { title: "Conciergerie & Leads", section: "Relations" };
    return { title: "Console Direction", section: "Admin" };
  }, [pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans antialiased">
      <Suspense fallback={null}>
        <ToastQueryListener />
      </Suspense>
      {/* ==================================================== */}
      {/* 🧭 DESKTOP SIDEBAR                                   */}
      {/* ==================================================== */}
      <aside
        className={`hidden lg:flex flex-col justify-between border-r bg-card h-full transition-all duration-200 z-20 shrink-0 ${
          sidebarCollapsed ? "w-16 p-2" : "w-72 p-4"
        }`}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Top Brand & Collapse Trigger */}
          <div className="flex items-center justify-between px-1">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-2">
                <BrandLogo variant="horizontal" size="sm" showSubtitle={false} href="/" />
                <span className="rounded-sm bg-primary/10 text-primary px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                  Admin
                </span>
              </div>
            ) : (
              <div className="mx-auto">
                <BrandLogo variant="mark-only" size="sm" href="/" />
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              title={sidebarCollapsed ? "Agrandir le menu" : "Réduire le menu"}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-5">
            {navItems.map((group) => (
              <div key={group.group} className="space-y-1">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block mb-1">
                    {group.group}
                  </span>
                )}
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                      title={sidebarCollapsed ? link.label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{link.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Quick Links */}
            {!sidebarCollapsed && (
              <div className="pt-2 border-t space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 block mb-1">
                  Accès Public & Simulations
                </span>
                <Link
                  href="/examens/demo-101-ce/ce"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>Tester CBT 101 CE (60 min)</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-70" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Voir le Site Public</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-70" />
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Footer: Infrastructure & Health Status */}
        {!sidebarCollapsed && (
          <div className="rounded-xl border bg-muted/30 p-3 space-y-2 text-[11px] shrink-0 mt-4">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                PostgreSQL Local :5434
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono">Connecté</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Studio Web :3002</span>
              <span className="font-mono">Prêt</span>
            </div>
            <div className="pt-1.5 border-t text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Super4C2 Enterprise</span>
              <span className="text-primary font-bold">Établissements</span>
            </div>
          </div>
        )}
      </aside>

      {/* ==================================================== */}
      {/* 📊 MAIN CONTENT CANVAS                               */}
      {/* ==================================================== */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Navigation */}
        <header className="h-14 shrink-0 flex items-center justify-between border-b bg-card/95 backdrop-blur-md px-4 sm:px-6 z-10">
          <div className="flex items-center gap-3">
            {/* Logo on Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <BrandLogo variant="mark-only" size="sm" href="/" />
            </div>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/admin" className="font-bold text-foreground hover:underline">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">{breadcrumbInfo.section}</span>
              <ChevronRight className="h-3 w-3 shrink-0 hidden sm:inline" />
              <span className="text-primary font-semibold truncate max-w-[200px] sm:max-w-none">
                {breadcrumbInfo.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2 border-l pl-2.5 sm:pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
                DS
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <p className="font-bold text-foreground">Direction Exécutive</p>
                <p className="text-[10px] text-muted-foreground">Super Admin</p>
              </div>
              <button
                onClick={handleAdminLogout}
                className="p-1.5 rounded-lg border bg-muted/40 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all ml-1"
                title="Déconnexion du Back-Office"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* ==================================================== */}
      {/* 📱 NATIVE MOBILE BOTTOM BAR                          */}
      {/* ==================================================== */}
      <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-50 rounded-2xl border bg-card/95 backdrop-blur-xl p-1.5 shadow-2xl flex items-center justify-around">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            pathname === "/admin" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Aperçu</span>
        </Link>
        <Link
          href="/admin/series-ce"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            pathname.startsWith("/admin/series-ce")
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Séries CE</span>
        </Link>
        <Link
          href="/admin/series-ee"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            pathname.startsWith("/admin/series-ee")
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground"
          }`}
        >
          <PenTool className="h-4 w-4" />
          <span>Séries EE</span>
        </Link>
        <Link
          href="/admin/blog"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            pathname.startsWith("/admin/blog")
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground"
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          <span>Blog</span>
        </Link>
        <Link
          href="/admin/faqs"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
            pathname.startsWith("/admin/faqs")
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground"
          }`}
        >
          <CircleHelp className="h-4 w-4" />
          <span>FAQs</span>
        </Link>
      </nav>
    </div>
  );
}
