"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/admin-csv-export";
import { toast } from "sonner";

interface AdminExportButtonProps<T extends Record<string, unknown>> {
  filename: string;
  data: T[];
  columns: { key: keyof T; label: string }[];
  label?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "secondary" | "outline" | "ghost";
}

export function AdminExportButton<T extends Record<string, unknown>>({
  filename,
  data,
  columns,
  label = "Exporter CSV",
  size = "sm",
  variant = "outline",
}: AdminExportButtonProps<T>) {
  const handleExport = () => {
    if (data.length === 0) {
      toast.info("Aucune donnée à exporter.");
      return;
    }
    downloadCsv(filename, data, columns);
    toast.success(`${data.length} élément(s) exporté(s) en CSV.`);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleExport}
      className="gap-1.5 shrink-0"
      title="Télécharger l'extraction au format CSV (compatible Excel & Sheets)"
    >
      <Download className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}
