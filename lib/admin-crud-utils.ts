export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toOptionalString(value: FormDataEntryValue | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function toBoolean(value: FormDataEntryValue | null | undefined): boolean {
  if (typeof value !== "string") {
    return false;
  }
  return value === "on" || value === "true" || value === "1";
}

export function toCsvArray(value: FormDataEntryValue | null | undefined): string[] {
  if (typeof value !== "string") {
    return [];
  }

  const normalized = value.replace(/[\n;]+/g, ",");

  return Array.from(
    new Set(
      normalized
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    )
  );
}

export function toOptionalDate(
  value: FormDataEntryValue | null | undefined
): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function toInteger(
  value: FormDataEntryValue | null | undefined,
  fallback: number,
  min?: number
): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  if (typeof min === "number" && parsed < min) {
    return min;
  }

  return parsed;
}

export function toFloat(
  value: FormDataEntryValue | null | undefined,
  fallback: number,
  min?: number
): number {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  if (typeof min === "number" && parsed < min) {
    return min;
  }

  return parsed;
}
