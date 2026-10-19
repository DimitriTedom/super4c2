"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  BookOpenText,
  TrendingUp,
  Search,
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  LayoutDashboard,
  Activity,
  X,
  LogOut,
  BookOpen,
  FolderKanban,
  CircleHelp,
  MessageSquareQuote,
  Loader2,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Mic,
  GraduationCap,
  Mail,
  Headphones,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ==========================================
// 📊 TYPES & DATA MODELS
// ==========================================

export type AdminTab = "overview" | "students";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  org: string;
  examDate: string;
  testType: "TCF Canada" | "TEF Canada" | "IELTS General";
  ceScore: number;
  ceNclc: string;
  coScore: number;
  coNclc: string;
  eeScore: string;
  eeNclc: string;
  eoScore: string;
  eoNclc: string;
  crsStatus: "Objectif Canada Validé" | "En progression" | "À renforcer" | "Prêt (+50 pts CRS)" | "À risque (NCLC < 7)";
  statusColor: string;
}

export interface ActivityItem {
  id: string | number;
  student: string;
  org: string;
  action: string;
  badge: string;
  badgeColor: string;
  time: string;
  initials: string;
}

export interface AdminDashboardProps {
  initialCandidates?: Candidate[];
  recentActivities?: ActivityItem[];
  kpiStats?: {
    totalCandidates: number;
    passRate: number;
    totalSimulations: number;
    avgScore: number;
  };
  liveCounts?: {
    faqs: number;
    testimonials: number;
    leads: number;
    blog: number;
    series: number;
  };
}

const ITEMS_PER_PAGE = 10;

export function AdminDashboard({
  initialCandidates = [],
  recentActivities = [],
  kpiStats,
  liveCounts,
}: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAdminLogout = () => {
    toast.info("Session administrateur déconnectée.");
    window.location.href = "/logout";
  };

  // 1. KPI Metric Cards réels
  const kpis = [
    {
      title: "Candidats Inscrits",
      description: "Profils enregistrés sur la plateforme",
      value: kpiStats ? String(kpiStats.totalCandidates) : "0",
      change: "En direct",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: "Taux de Réussite Canada",
      description: "Candidats ayant atteint le niveau requis (B2/C1)",
      value: kpiStats ? `${kpiStats.passRate.toFixed(1)}%` : "0.0%",
      change: "Niveau B2+",
      trend: "up" as const,
      icon: Award,
    },
    {
      title: "Examens Blancs Passés",
      description: "Épreuves complétées et évaluées par l'IA",
      value: kpiStats ? String(kpiStats.totalSimulations) : "0",
      change: "Temps réel",
      trend: "up" as const,
      icon: BookOpenText,
    },
    {
      title: "Score Moyen en Lecture",
      description: "Moyenne générale sur 699 points (CE)",
      value: kpiStats && kpiStats.avgScore > 0 ? `${kpiStats.avgScore} pts` : "—",
      change: "Sur 699",
      trend: "up" as const,
      icon: TrendingUp,
    },
  ];

  // Candidats réels filtrés
  const candidates: Candidate[] = initialCandidates;

  const filteredCandidates = candidates.filter((c) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "ready" && (c.crsStatus.includes("Validé") || c.crsStatus.includes("Prêt"))) ||
      (statusFilter === "progress" && c.crsStatus.includes("progression")) ||
      (statusFilter === "risk" && (c.crsStatus.includes("renforcer") || c.crsStatus.includes("risque")));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.org.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Pagination pour la table candidats
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* ==================================================== */}
      {/* 🧭 DESKTOP SIDEBAR                                   */}
      {/* ==================================================== */}
      <aside
        className={`hidden lg:flex flex-col justify-between border-r bg-card h-full transition-all duration-200 z-20 shrink-0 ${
          sidebarCollapsed ? "w-16 p-2" : "w-72 p-4"
        }`}
      >
        <div className="space-y-5 overflow-y-auto">
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
          <nav className="space-y-4 text-xs">
            <div>
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                  Suivi des Candidats
                </span>
              )}
              <div className="mt-1.5 space-y-1">
                <button
                  onClick={() => setCurrentTab("overview")}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    currentTab === "overview"
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                  title={sidebarCollapsed ? "Vue d'ensemble" : undefined}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>Vue d&apos;ensemble</span>}
                </button>

                <button
                  onClick={() => setCurrentTab("students")}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    currentTab === "students"
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${sidebarCollapsed ? "justify-center px-2" : ""}`}
                  title={sidebarCollapsed ? "Candidats inscrits" : undefined}
                >
                  <Users className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>Candidats inscrits</span>}
                </button>

                <Link
                  href="/admin/tentatives"
                  onClick={() => setPendingHref("/admin/tentatives")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Copies & Examens passés" : undefined}
                >
                  {pendingHref === "/admin/tentatives" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Copies &amp; Examens passés</span>}
                </Link>
              </div>
            </div>

            <div>
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                  Sujets d&apos;Examens
                </span>
              )}
              <div className="mt-1.5 space-y-1">
                <Link
                  href="/admin/series-ce"
                  onClick={() => setPendingHref("/admin/series-ce")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Lecture (Compréhension Écrite)" : undefined}
                >
                  {pendingHref === "/admin/series-ce" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Lecture (Compréhension Écrite)</span>}
                </Link>

                <Link
                  href="/admin/series-co"
                  onClick={() => setPendingHref("/admin/series-co")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Écoute (Compréhension Orale)" : undefined}
                >
                  {pendingHref === "/admin/series-co" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <Headphones className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Écoute (Compréhension Orale)</span>}
                </Link>

                <Link
                  href="/admin/series-ee"
                  onClick={() => setPendingHref("/admin/series-ee")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Rédaction (Expression Écrite)" : undefined}
                >
                  {pendingHref === "/admin/series-ee" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <PenTool className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Rédaction (Expression Écrite)</span>}
                </Link>

                <Link
                  href="/admin/series-eo"
                  onClick={() => setPendingHref("/admin/series-eo")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Oral & Visio (Expression Orale)" : undefined}
                >
                  {pendingHref === "/admin/series-eo" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <Mic className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Oral &amp; Visio (Expression Orale)</span>}
                </Link>
              </div>
            </div>

            <div>
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                  Site &amp; Communication
                </span>
              )}
              <div className="mt-1.5 space-y-1">
                <Link
                  href="/admin/blog"
                  onClick={() => setPendingHref("/admin/blog")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Articles de Blog & Guides" : undefined}
                >
                  {pendingHref === "/admin/blog" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <FolderKanban className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Articles de Blog &amp; Guides</span>}
                </Link>

                <Link
                  href="/admin/faqs"
                  onClick={() => setPendingHref("/admin/faqs")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Questions fréquentes (FAQ)" : undefined}
                >
                  {pendingHref === "/admin/faqs" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <CircleHelp className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Questions fréquentes (FAQ)</span>}
                </Link>

                <Link
                  href="/admin/temoignages"
                  onClick={() => setPendingHref("/admin/temoignages")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Avis des candidats" : undefined}
                >
                  {pendingHref === "/admin/temoignages" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <MessageSquareQuote className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Avis des candidats</span>}
                </Link>

                <Link
                  href="/admin/newsletter"
                  onClick={() => setPendingHref("/admin/newsletter")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Abonnés Newsletter" : undefined}
                >
                  {pendingHref === "/admin/newsletter" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Abonnés Newsletter</span>}
                </Link>

                <Link
                  href="/admin/leads"
                  onClick={() => setPendingHref("/admin/leads")}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${
                    sidebarCollapsed ? "justify-center px-2" : ""
                  }`}
                  title={sidebarCollapsed ? "Demandes de contact" : undefined}
                >
                  {pendingHref === "/admin/leads" ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand-crimson" />
                  ) : (
                    <Users className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  {!sidebarCollapsed && <span>Demandes de contact</span>}
                </Link>
              </div>
            </div>

            {/* Quick Links Section */}
            {!sidebarCollapsed && (
              <div className="pt-2 border-t space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                  Accès Candidat &amp; Simulateurs
                </span>
                <Link
                  href="/examens/101/ee/intro"
                  target="_blank"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <PenTool className="h-3.5 w-3.5 text-primary" />
                  <span>Tester Expression Écrite</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-70" />
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
                Supabase PostgreSQL
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">Cloud Actif</span>
            </div>
            <div className="pt-1.5 border-t text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Super4C2 Plateforme</span>
              <span className="text-primary font-bold">TCF &amp; TEF Canada</span>
            </div>
          </div>
        )}
      </aside>

      {/* ==================================================== */}
      {/* 📊 MAIN CONTENT CANVAS                               */}
      {/* ==================================================== */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 shrink-0 flex items-center justify-between border-b bg-card/95 backdrop-blur-md px-4 sm:px-6 z-10">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <BrandLogo variant="mark-only" size="sm" href="/" />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">Admin</span>
              <span>/</span>
              <span className="text-primary font-semibold">
                {currentTab === "overview" && "Vue d'Ensemble"}
                {currentTab === "students" && "Candidats & Scores NCLC"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell recipient="ADMIN" />
            <ThemeToggle />

            {/* Profile & Logout */}
            <div className="flex items-center gap-2 border-l pl-2.5 sm:pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
                DS
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <p className="font-bold text-foreground">Direction</p>
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

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Quick Strip Indicators */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-2xs text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>Supervision en direct · Base de production</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <Link
                  href="/admin/series-ee"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
                >
                  <PenTool className="h-3.5 w-3.5 text-primary" />
                  <span>Séries EE Conformes</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
                <Link
                  href="/admin/newsletter"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>Abonnés Newsletter</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
                <Link
                  href="/admin/leads"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
                >
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>{liveCounts?.leads ?? 0} Demandes de Contact</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
                <Link
                  href="/admin/blog"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
                >
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>{liveCounts?.blog ?? 0} Articles Blog</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </div>
            </div>

            {/* ==================================================== */}
            {/* 🌟 VUE 1 : VUE D'ENSEMBLE (OVERVIEW)                  */}
            {/* ==================================================== */}
            {currentTab === "overview" && (
              <div className="space-y-6">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                      Tableau de Bord Exécutif
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Supervision des candidats, taux d&apos;atteinte du NCLC 7 (+50 pts CRS) et métriques clés.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/examens/101/ee/intro" target="_blank">
                      <Button size="sm" className="gap-1.5 font-bold">
                        <PenTool className="h-4 w-4" />
                        <span>Simulateur Candidat</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentTab("students")}
                      className="gap-1.5 font-semibold"
                    >
                      <Users className="h-4 w-4" />
                      <span>Liste Candidats</span>
                    </Button>
                  </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border bg-card p-5 shadow-xs transition-all hover:border-primary/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">{kpi.title}</span>
                          <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                            <Icon className="size-4 text-primary" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-display font-medium text-3xl tabular-nums leading-none tracking-tight text-foreground">
                              {kpi.value}
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-sm border border-emerald-600/30 bg-emerald-500/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                              <TrendingUp className="size-3" />
                              {kpi.change}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs mt-1">{kpi.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Modules & Activité en direct */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Left: Modules d'Épreuves Actives */}
                  <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-base font-bold text-foreground">
                          Épreuves d&apos;Entraînement Officielles
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Simulations conformes aux grilles du TCF Canada et TEF Canada.
                        </p>
                      </div>
                      <span className="rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        Normes Officielles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <PenTool className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-foreground">Expression Écrite</h3>
                              <p className="text-[11px] text-muted-foreground">60 min · 3 Rédactions</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Actif
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Correction automatique par IA sur 20 avec retour critérié et suggestion de reformulation C2.
                        </p>
                        <div className="pt-2 border-t flex items-center justify-between">
                          <Link
                            href="/admin/series-ee"
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>Gérer les Séries</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          <Link
                            href="/examens/101/ee/intro"
                            target="_blank"
                            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Tester</span>
                          </Link>
                        </div>
                      </div>

                      <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <Mic className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-foreground">Expression Orale</h3>
                              <p className="text-[11px] text-muted-foreground">12 min · Visio Studio IA</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Actif
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          3 Tâches officielles (Présentation, Jeu de rôle, Débat) avec interlocuteur IA en voix naturelle.
                        </p>
                        <div className="pt-2 border-t flex items-center justify-between">
                          <Link
                            href="/admin/series-eo"
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>Gérer les Séries</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          <Link
                            href="/examens/101/eo/intro"
                            target="_blank"
                            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Tester</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Widget: Live Activity Stream */}
                  <div className="rounded-xl border bg-card p-6 shadow-xs space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <div>
                          <h2 className="font-display text-base font-bold text-foreground">
                            Examens en Direct
                          </h2>
                          <p className="text-[11px] text-muted-foreground">Flux en direct des soumissions</p>
                        </div>
                      </div>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Surveillance en temps réel" />
                    </div>

                    <div className="space-y-3.5 text-xs">
                      {recentActivities.length > 0 ? (
                        <>
                          {recentActivities.map((act) => (
                            <div key={act.id} className="flex gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                                {act.initials}
                              </div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="font-semibold text-foreground truncate">
                                    {act.student}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground shrink-0">{act.time}</span>
                                </div>
                                <p className="text-muted-foreground text-[11px] leading-tight truncate">{act.action}</p>
                                <div className="pt-0.5">
                                  <span
                                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${act.badgeColor}`}
                                  >
                                    {act.badge}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 border-t text-center">
                            <Link
                              href="/admin/tentatives"
                              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                            >
                              <span>Voir toutes les copies rendues</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          <p className="font-semibold text-xs">Aucun examen passé pour le moment</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Dès qu&apos;un candidat termine un test, son résultat s&apos;affichera ici en direct.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Datatable Preview (Top Candidates) */}
                <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="font-display text-base font-bold text-foreground">
                        Dernières Évaluations des Candidats
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Extraction des profils récents et niveau linguistique estimé.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentTab("students")}
                      className="gap-1 text-xs text-primary font-bold"
                    >
                      <span>Voir la liste complète</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                          <th className="py-2.5 px-3">Candidat</th>
                          <th className="py-2.5 px-3">Date Examen</th>
                          <th className="py-2.5 px-3 text-center">Écrit (/20)</th>
                          <th className="py-2.5 px-3 text-center">Oral (/20)</th>
                          <th className="py-2.5 px-3">Niveau Canada</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {candidates.length > 0 ? (
                          candidates.slice(0, 5).map((cand) => (
                            <tr key={cand.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted font-bold text-[10px]">
                                    {cand.avatar}
                                  </div>
                                  <div>
                                    <p className="font-bold text-foreground">{cand.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{cand.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-muted-foreground">{cand.examDate}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-foreground">
                                {cand.eeScore}{" "}
                                <span className="text-[10px] font-normal text-muted-foreground">
                                  ({cand.eeNclc})
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-foreground">
                                {cand.eoScore}{" "}
                                <span className="text-[10px] font-normal text-muted-foreground">
                                  ({cand.eoNclc})
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${cand.statusColor}`}
                                >
                                  {cand.crsStatus}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-muted-foreground">
                              Aucun candidat inscrit pour le moment.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* 🌟 VUE 2 : CANDIDATS & PROGRESSION                  */}
            {/* ==================================================== */}
            {currentTab === "students" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-black tracking-tight text-foreground">
                    Suivi des Candidats &amp; Progression
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Historique individuel des entraînements et validation du seuil linguistique requis pour l&apos;immigration Canada.
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-xs">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Rechercher par nom ou email..."
                      className="w-full rounded-lg border bg-muted/30 pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
                    <span className="text-[11px] font-semibold text-muted-foreground mr-1">Statut :</span>
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setCurrentPage(1);
                      }}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        statusFilter === "all" ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      Tous ({candidates.length})
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("ready");
                        setCurrentPage(1);
                      }}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        statusFilter === "ready" ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      Objectif Validé
                    </button>
                    <button
                      onClick={() => {
                        setStatusFilter("risk");
                        setCurrentPage(1);
                      }}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        statusFilter === "risk" ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      En Progression
                    </button>
                  </div>
                </div>

                {/* Candidates Datatable */}
                <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b bg-muted/40 text-muted-foreground font-semibold">
                          <th className="py-3 px-4">Candidat</th>
                          <th className="py-3 px-4">Date Examen</th>
                          <th className="py-3 px-4 text-center">Rédaction (/20)</th>
                          <th className="py-3 px-4 text-center">Oral (/20)</th>
                          <th className="py-3 px-4 text-center">Lecture (pts)</th>
                          <th className="py-3 px-4 text-center">Écoute (pts)</th>
                          <th className="py-3 px-4">Statut Canada</th>
                          <th className="py-3 px-4 text-right">Copies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {paginatedCandidates.length > 0 ? (
                          paginatedCandidates.map((cand) => (
                            <tr key={cand.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-xs">
                                    {cand.avatar}
                                  </div>
                                  <div>
                                    <p className="font-bold text-foreground">{cand.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{cand.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-muted-foreground">{cand.examDate}</td>
                              <td className="py-3.5 px-4 text-center font-mono">
                                <span className="font-bold text-foreground">{cand.eeScore}</span>
                                <span className="block text-[10px] text-muted-foreground">{cand.eeNclc}</span>
                              </td>
                              <td className="py-3.5 px-4 text-center font-mono">
                                <span className="font-bold text-foreground">{cand.eoScore}</span>
                                <span className="block text-[10px] text-muted-foreground">{cand.eoNclc}</span>
                              </td>
                              <td className="py-3.5 px-4 text-center font-mono">
                                <span className="font-bold text-foreground">{cand.ceScore > 0 ? cand.ceScore : "—"}</span>
                                <span className="block text-[10px] text-muted-foreground">{cand.ceNclc}</span>
                              </td>
                              <td className="py-3.5 px-4 text-center font-mono">
                                <span className="font-bold text-foreground">{cand.coScore > 0 ? cand.coScore : "—"}</span>
                                <span className="block text-[10px] text-muted-foreground">{cand.coNclc}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cand.statusColor}`}
                                >
                                  {cand.crsStatus}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedCandidate(cand)}
                                  className="h-7 px-2 text-xs text-primary font-bold"
                                >
                                  Détails
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-muted-foreground">
                              {searchQuery || statusFilter !== "all"
                                ? "Aucun candidat ne correspond à vos filtres de recherche."
                                : "Aucun candidat inscrit pour le moment dans la base de données."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PIED DE TABLEAU POUR LA PAGINATION */}
                  {filteredCandidates.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
                      <div>
                        Affichage de <span className="font-semibold text-foreground">{startIndex + 1}</span> à{" "}
                        <span className="font-semibold text-foreground">
                          {Math.min(startIndex + ITEMS_PER_PAGE, filteredCandidates.length)}
                        </span>{" "}
                        sur <span className="font-semibold text-foreground">{filteredCandidates.length}</span> candidat(s)
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px]">
                          Page <strong className="text-foreground">{currentPage}</strong> sur{" "}
                          <strong className="text-foreground">{totalPages}</strong>
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="h-7 w-7 p-0"
                            title="Page précédente"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="h-7 w-7 p-0"
                            title="Page suivante"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate Details Modal */}
                {selectedCandidate && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
                            {selectedCandidate.avatar}
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-bold text-foreground">
                              {selectedCandidate.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{selectedCandidate.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedCandidate(null)}
                          className="p-1 rounded-lg border bg-muted/40 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs border-y py-4">
                        <div>
                          <p className="text-muted-foreground text-[10px]">Origine / Pays</p>
                          <p className="font-semibold text-foreground">{selectedCandidate.org}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Date Prévue d&apos;Examen</p>
                          <p className="font-semibold text-foreground">{selectedCandidate.examDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Type d&apos;Épreuve</p>
                          <p className="font-semibold text-foreground">{selectedCandidate.testType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-[10px]">Statut Immigration Canada</p>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400">
                            {selectedCandidate.crsStatus}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-bold text-foreground">Scores des Compétences :</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg border bg-muted/30 p-2.5">
                            <span className="text-[10px] text-muted-foreground block">Expression Écrite</span>
                            <span className="font-mono font-bold text-foreground text-sm">
                              {selectedCandidate.eeScore}
                            </span>
                            <span className="text-[10px] text-primary ml-1 font-semibold">
                              ({selectedCandidate.eeNclc})
                            </span>
                          </div>
                          <div className="rounded-lg border bg-muted/30 p-2.5">
                            <span className="text-[10px] text-muted-foreground block">Expression Orale</span>
                            <span className="font-mono font-bold text-foreground text-sm">
                              {selectedCandidate.eoScore}
                            </span>
                            <span className="text-[10px] text-primary ml-1 font-semibold">
                              ({selectedCandidate.eoNclc})
                            </span>
                          </div>
                          <div className="rounded-lg border bg-muted/30 p-2.5">
                            <span className="text-[10px] text-muted-foreground block">Compréhension Écrite</span>
                            <span className="font-mono font-bold text-foreground text-sm">
                              {selectedCandidate.ceScore > 0 ? `${selectedCandidate.ceScore} / 699` : "—"}
                            </span>
                            <span className="text-[10px] text-primary ml-1 font-semibold">
                              ({selectedCandidate.ceNclc})
                            </span>
                          </div>
                          <div className="rounded-lg border bg-muted/30 p-2.5">
                            <span className="text-[10px] text-muted-foreground block">Compréhension Orale</span>
                            <span className="font-mono font-bold text-foreground text-sm">
                              {selectedCandidate.coScore > 0 ? `${selectedCandidate.coScore} / 699` : "—"}
                            </span>
                            <span className="text-[10px] text-primary ml-1 font-semibold">
                              ({selectedCandidate.coNclc})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(null)}>
                          Fermer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
