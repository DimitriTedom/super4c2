import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Space_Mono } from "next/font/google";
import "./../styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { SiteHeader } from "@/components/site-header";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { ToastifyContainer } from "@/components/ui/toastify";
import { NewcomerGuideModal } from "@/components/onboarding/newcomer-guide-modal";
import { FloatingCommunityButton } from "@/components/community/floating-community-button";

import { JsonLd } from "@/components/seo/json-ld";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://super4c2.com"),
  title: {
    default: "Super4C2 | Préparation TCF, TEF Canada & IELTS — Objectif C2 / CLB 9",
    template: "%s | Super4C2",
  },
  description:
    "Plateforme officielle d'entraînement aux examens TCF Canada, TEF Canada et Cambridge IELTS General Training. Simulateur CBT officiel, examinateur oral IA en direct, 4 épreuves chronométrées et correction FEI instantanée.",
  keywords: [
    "TCF Canada",
    "TEF Canada",
    "IELTS General Training",
    "NCLC 7",
    "CLB 9",
    "Entrée Express Canada",
    "Immigration Canada",
    "Simulateur CBT",
    "Compréhension Écrite",
    "Compréhension Orale",
    "Expression Écrite",
    "Expression Orale",
    "CRS Score",
    "France Éducation International",
  ],
  authors: [{ name: "Super4C2 Editorial Team" }],
  creator: "Super4C2",
  publisher: "Super4C2",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "fr-CA": "https://super4c2.com",
      "en-CA": "https://super4c2.com/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    alternateLocale: ["en_CA", "fr_FR"],
    url: "https://super4c2.com",
    siteName: "Super4C2",
    title: "Super4C2 | Préparation TCF, TEF Canada & IELTS — Objectif C2 / CLB 9",
    description:
      "Simulateur CBT officiel, 4 épreuves chronométrées, correction IA instantanée et examinateur vocal IA pour décrocher le NCLC 7+ (+50 pts CRS) et CLB 9.",
    images: [
      {
        url: "/brand/og-image-super4c2.jpg",
        width: 1200,
        height: 630,
        alt: "Super4C2 — Plateforme d'Examen CBT Officiel TCF Canada, TEF & IELTS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Super4C2 | Préparation TCF, TEF Canada & IELTS — Objectif C2 / CLB 9",
    description:
      "Simulateur CBT officiel, 4 épreuves chronométrées et examinateur vocal IA pour maximiser vos points Entrée Express Canada.",
    images: ["/brand/og-image-super4c2.jpg"],
    creator: "@super4c2",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${bricolage.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <JsonLd />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <AppShell header={<SiteHeader />}>{children}</AppShell>
            <FloatingCommunityButton />
            <NewcomerGuideModal />
            <CookieConsentBanner />
            <Toaster />
            <ToastifyContainer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
