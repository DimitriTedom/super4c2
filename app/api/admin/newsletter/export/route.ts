import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });

    const headers = [
      "Nom",
      "Email",
      "Telephone_WhatsApp",
      "Score_CRS",
      "Profil_NCLC",
      "Statut",
      "Source",
      "Date Inscription",
      "Date Desinscription",
    ];
    const rows = subscribers.map((s) => [
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${(s.phone || "").replace(/"/g, '""')}"`,
      `"${s.crsScore != null ? s.crsScore : ""}"`,
      `"${(s.nclcProfile || "").replace(/"/g, '""')}"`,
      `"${s.isActive ? "Actif" : "Desinscrit"}"`,
      `"${s.source}"`,
      `"${s.subscribedAt.toISOString()}"`,
      `"${s.unsubscribedAt ? s.unsubscribedAt.toISOString() : ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `super4c2-newsletter-subscribers-${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Erreur export CSV newsletter:", error);
    return new NextResponse("Erreur lors de l'export CSV", { status: 500 });
  }
}
