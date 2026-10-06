import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Space_Mono } from "next/font/google";
import "./../styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { AppShell } from "@/components/app-shell";
import { Toaster } from "@/components/ui/sonner";

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
  title: {
    default: "Super4C2 | Préparation TCF & TEF Canada — Objectif C2 / NCLC 7+",
    template: "%s | Super4C2",
  },
  description:
    "Plateforme d'entraînement officielle au TCF Canada et TEF Canada. Simulateur d'examen CBT officiel, examinateur oral vocal interactif IA et correction FEI instantanée.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${bricolage.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AppShell header={<SiteHeader />}>{children}</AppShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
