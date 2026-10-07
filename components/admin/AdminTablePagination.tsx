"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  search?: string;
}

export function AdminTablePagination({
  currentPage,
  totalPages,
  basePath,
  search,
}: AdminTablePaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
      <div className="text-xs text-muted-foreground">
        Page <span className="font-bold text-foreground">{currentPage}</span> sur{" "}
        <span className="font-bold text-foreground">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          asChild={currentPage > 1}
        >
          {currentPage > 1 ? (
            <Link href={getPageUrl(currentPage - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 opacity-50">
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          asChild={currentPage < totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={getPageUrl(currentPage + 1)} className="gap-1">
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 opacity-50">
              <span>Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
