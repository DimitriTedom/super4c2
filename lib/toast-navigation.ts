export type ToastVariant = "default" | "success" | "error" | "warning";

interface ToastRedirectOptions {
  title?: string;
  message: string;
  variant?: ToastVariant;
}

const TOAST_QUERY_KEYS = [
  "__toast",
  "toastVariant",
  "toastTitle",
  "toastMessage",
] as const;

export function withToastQuery(path: string, options: ToastRedirectOptions): string {
  const [basePath, queryString = ""] = path.split("?");
  const params = new URLSearchParams(queryString);

  params.set("__toast", "1");
  params.set("toastVariant", options.variant ?? "default");
  params.set("toastMessage", options.message);

  if (options.title) {
    params.set("toastTitle", options.title);
  } else {
    params.delete("toastTitle");
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function removeToastQuery(searchParams: URLSearchParams): URLSearchParams {
  const nextParams = new URLSearchParams(searchParams.toString());

  TOAST_QUERY_KEYS.forEach((key) => {
    nextParams.delete(key);
  });

  return nextParams;
}
