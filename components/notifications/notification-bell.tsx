"use client";

import React, { useState, useEffect, useCallback, useTransition, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  CheckCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  getNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction,
  clearReadNotificationsAction,
  type NotificationItem,
} from "@/lib/notifications/actions";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface NotificationBellProps {
  recipient?: "CANDIDATE" | "ADMIN";
  className?: string;
}

export function NotificationBell({
  recipient = "CANDIDATE",
  className = "",
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    startTransition(async () => {
      try {
        const res = await getNotificationsAction({ recipient });
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      } catch {
        // Ignored
      }
    });
  }, [recipient]);

  useEffect(() => {
    fetchNotifications();

    // Poll every 45s for fresh notifications
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Handle click outside to close dropdown
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

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsReadAction(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsReadAction(recipient);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("Toutes les notifications ont été marquées comme lues.");
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteNotificationAction(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => {
        const target = notifications.find((n) => n.id === id);
        return target && !target.isRead ? Math.max(0, prev - 1) : prev;
      });
      toast.success("Notification supprimée.");
    });
  };

  const handleClearRead = () => {
    startTransition(async () => {
      const res = await clearReadNotificationsAction(recipient);
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => !n.isRead));
        toast.success(`${res.count} notification(s) archivée(s) supprimée(s).`);
      }
    });
  };

  const displayedNotifications =
    filter === "UNREAD" ? notifications.filter((n) => !n.isRead) : notifications;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EXAM":
        return <BookOpen className="h-4 w-4 text-[#E51A31]" />;
      case "SRS":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case "LEAD":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "BILLING":
        return <CreditCard className="h-4 w-4 text-emerald-500" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-primary" />;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return `Il y a ${diffDays} j`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground transition-all hover:bg-muted/60 focus:outline-hidden focus:ring-2 focus:ring-primary/40 shadow-2xs"
        aria-label="Centre de notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E51A31] px-1 text-[10px] font-bold text-white ring-2 ring-background animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Card */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-2xl border border-border/80 bg-popover/95 p-4 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-foreground">
                Notifications
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                {recipient === "ADMIN" ? "Super Admin" : "Candidat"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={isPending}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Tout lire</span>
                </button>
              )}

              {notifications.some((n) => n.isRead) && (
                <button
                  type="button"
                  onClick={handleClearRead}
                  disabled={isPending}
                  className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors"
                  title="Supprimer toutes les notifications déjà lues"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Vider lues</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 pt-3 pb-2 text-xs">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`rounded-full px-2.5 py-1 font-medium transition-all ${
                filter === "ALL"
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("UNREAD")}
              className={`rounded-full px-2.5 py-1 font-medium transition-all ${
                filter === "UNREAD"
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-border/40 pt-1 -mx-2 px-2 scrollbar-thin">
            {displayedNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <Info className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
                <p>Aucune notification pour le moment.</p>
              </div>
            ) : (
              displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`group relative flex items-start gap-3 rounded-xl p-2.5 transition-all pt-3 ${
                    notif.isRead
                      ? "opacity-75 hover:opacity-100 hover:bg-muted/40"
                      : "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                  }`}
                >
                  {/* Icon */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background border border-border/80 shadow-2xs mt-0.5">
                    {getTypeIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1 text-[10px]">
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => {
                            if (!notif.isRead) handleMarkAsRead(notif.id);
                            setOpen(false);
                          }}
                          className="flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          <span>Voir les détails</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}

                      {!notif.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Marquer comme lu
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(notif.id)}
                        className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        title="Supprimer cette notification"
                        aria-label="Supprimer cette notification"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="border-t pt-2.5 mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Synchronisation temps réel</span>
            <span className="font-semibold text-foreground">Super4C2 🇨🇦</span>
          </div>
        </div>
      )}
    </div>
  );
}
