"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTableSelectAllProps {
  formId: string;
  inputName?: string;
  className?: string;
}

export function AdminTableSelectAll({
  formId,
  inputName = "selectedIds",
  className,
}: AdminTableSelectAllProps) {
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const escapeSelectorValue = useCallback((value: string) => value.replace(/"/g, '\\"'), []);

  const selector = useMemo(
    () => `input[type="checkbox"][name="${escapeSelectorValue(inputName)}"][form="${escapeSelectorValue(formId)}"]`,
    [escapeSelectorValue, formId, inputName],
  );

  const refreshState = useCallback(() => {
    const checkboxes = Array.from(document.querySelectorAll<HTMLInputElement>(selector));
    setTotalCount(checkboxes.length);
    setCheckedCount(checkboxes.filter((checkbox) => checkbox.checked).length);
  }, [selector]);

  useEffect(() => {
    refreshState();
    document.addEventListener("change", refreshState);
    return () => {
      document.removeEventListener("change", refreshState);
    };
  }, [refreshState]);

  const allSelected = totalCount > 0 && checkedCount === totalCount;

  const toggleAll = useCallback(() => {
    const nextChecked = !allSelected;
    const checkboxes = Array.from(document.querySelectorAll<HTMLInputElement>(selector));
    for (const checkbox of checkboxes) {
      checkbox.checked = nextChecked;
      checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    }
    refreshState();
  }, [allSelected, refreshState, selector]);

  return (
    <button
      type="button"
      onClick={toggleAll}
      disabled={totalCount === 0}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-lg border bg-muted/30 px-3 text-xs font-semibold text-muted-foreground transition",
        "hover:text-foreground hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      aria-label={allSelected ? "Désélectionner tous les éléments" : "Sélectionner tous les éléments"}
      title={allSelected ? "Désélectionner tous" : "Sélectionner tous"}
    >
      {allSelected ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
      <span>{allSelected ? "Tout désélectionner" : "Tout sélectionner"}</span>
    </button>
  );
}
