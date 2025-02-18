export type PaginatedResponse<T> = {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalSize: number;
};
