export const ADMIN_TABLE_PAGE_SIZE = 20;

export function parseAdminPageParam(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(1, Math.floor(parsed));
}

export function getAdminPagination(
  totalItems: number,
  pageParam: string | undefined,
  pageSize = ADMIN_TABLE_PAGE_SIZE
) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const requestedPage = parseAdminPageParam(pageParam);
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    skip,
    totalPages,
  };
}
