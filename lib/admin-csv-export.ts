/**
 * Utilitaire d'exportation CSV côté client avec BOM UTF-8 (\uFEFF)
 * Garantit un affichage parfait des accents français (é, è, ê, à, etc.)
 * dans Microsoft Excel, Apple Numbers et Google Sheets.
 */

export function downloadCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns: { key: keyof T; label: string }[]
) {
  if (rows.length === 0) return;

  const escapeCell = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = columns.map((c) => escapeCell(c.label)).join(";");
  const dataRows = rows.map((row) =>
    columns.map((c) => escapeCell(row[c.key])).join(";")
  );

  const csvContent = "\uFEFF" + [headers, ...dataRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
