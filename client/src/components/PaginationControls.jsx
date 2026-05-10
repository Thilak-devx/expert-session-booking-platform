function PaginationControls({ currentPage, totalPages, onPrevious, onNext, onPageSelect }) {
  const buildPageItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pageItems = buildPageItems();

  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/80 px-4 py-4 shadow-soft md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Go to previous page"
          disabled={currentPage === 1}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {pageItems.map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-sm font-medium text-slate-400" aria-hidden="true">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item !== currentPage) {
                    onPageSelect?.(item);
                  }
                }}
                aria-label={`Go to page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                className={`h-10 min-w-10 rounded-full px-3 text-sm font-medium transition ${
                  item === currentPage
                    ? "bg-slate-900 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Go to next page"
          disabled={currentPage === totalPages}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
