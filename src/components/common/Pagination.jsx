
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 8,
  onPageChange,
}) {
  const pages = Math.max(1, totalPages);
  const page = Math.min(Math.max(1, currentPage), pages);

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  function goToPage(nextPage) {
    if (
      nextPage >= 1 &&
      nextPage <= pages &&
      nextPage !== page &&
      typeof onPageChange === "function"
    ) {
      onPageChange(nextPage);
    }
  }

  return (
    <nav className="pagination" aria-label="Table pagination">
      <span className="pagination__info">
        {start}–{end} of {totalItems}
      </span>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__arrow"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeft size={17} />
        </button>

        {Array.from({ length: pages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              className={`pagination__number ${
                pageNumber === page ? "is-active" : ""
              }`}
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          type="button"
          className="pagination__arrow"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => goToPage(page + 1)}
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
}
