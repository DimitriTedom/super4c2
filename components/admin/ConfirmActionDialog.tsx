"use client";

import { type ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmActionDialogProps {
  formId?: string;
  title: string;
  description: string;
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  onConfirm?: () => void;
}

export function ConfirmActionDialog({
  formId,
  title,
  description,
  trigger,
  triggerClassName,
  triggerLabel,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  disabled = false,
  onConfirm,
}: ConfirmActionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={triggerLabel}
          disabled={disabled}
          className={cn(triggerClassName, disabled && "cursor-not-allowed opacity-60")}
        >
          {trigger}
        </button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card text-card-foreground sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground font-display text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm">
              {cancelLabel}
            </Button>
          </DialogClose>
          {formId ? (
            <Button
              type="submit"
              form={formId}
              variant="destructive"
              size="sm"
              className="font-bold bg-[#E51A31] hover:bg-[#B31224]"
            >
              {confirmLabel}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onConfirm}
              variant="destructive"
              size="sm"
              className="font-bold bg-[#E51A31] hover:bg-[#B31224]"
            >
              {confirmLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
