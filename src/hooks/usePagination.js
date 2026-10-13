
import { useMemo, useState } from "react";

export default function usePagination(
  data = [],
  initialPageSize = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = data.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;

    return data.slice(startIndex, startIndex + pageSize);
  }, [data, safePage, pageSize]);

  const goToPage = (page) => {
    const nextPage = Math.min(
      Math.max(1, Number(page) || 1),
      totalPages
    );

    setCurrentPage(nextPage);
  };

  const changePageSize = (size) => {
    const nextSize = Math.max(1, Number(size) || initialPageSize);

    setPageSize(nextSize);
    setCurrentPage(1);
  };

  const nextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const previousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const startItem =
    totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const endItem = Math.min(safePage * pageSize, totalItems);

  return {
    currentPage: safePage,
    pageSize,
    totalItems,
    totalPages,
    paginatedData,
    startItem,
    endItem,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    resetPagination,
    canGoNext: safePage < totalPages,
    canGoPrevious: safePage > 1,
  };
}