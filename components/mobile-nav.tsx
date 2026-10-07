"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpenText,
  Calculator,
  Newspaper,
  User,
} from "lucide-react";

export function MobileNavBar() {
  const pathname = usePathname();

  // On cache la barre mobile sur les écrans d'examen direct ou sur le super admin (qui a son propre bar mobile)
  const isExamRoom = /^\/examens\/[^/]+\/(ce|co|ee|eo)\/?$/.test(pathname);
  const isAdmin = pathname.startsWith("/admin");

  if (isExamRoom || isAdmin) {
    return null;
  }

  const navItems = [
    {
      label: "Accueil",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Épreuves",
      href: "/examens",
      icon: BookOpenText,
      isActive: pathname.startsWith("/examens"),
    },
    {
      label: "CRS Canada",
      href: "/nclc-calculator",
      icon: Calculator,
      badge: "+50",
      isActive: pathname === "/nclc-calculator",
    },
    {
      label: "Blog",
      href: "/blog",
      icon: Newspaper,
      isActive: pathname.startsWith("/blog") || pathname.startsWith("/sujets-recents"),
    },
    {
      label: "Compte",
      href: "/dashboard",
      icon: User,
      isActive: pathname.startsWith("/dashboard") || pathname.startsWith("/account") || pathname.startsWith("/auth"),
    },
  ];

  return (
    <nav
      aria-label="Navigation Mobile"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-xl px-2 py-1 shadow-lg pb-[env(safe-area-inset-bottom,0.5rem)]"
    >
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                active
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    active ? "scale-110 text-primary" : ""
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 rounded-full bg-brand-crimson text-white text-[8px] font-black px-1 py-0.2 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  active ? "font-bold text-foreground" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="h-1 w-5 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
