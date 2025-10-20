import React from 'react';

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

const Pagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
}) => {
  if (totalPages === 0) {
    return null;
  }

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {typeof totalItems === 'number' ? <span className="text-gray-400">• {totalItems} records</span> : null}
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => onPageChange?.(1)}
          disabled={!canGoBack}
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          « First
        </button>
        <button
          type="button"
          onClick={() => onPageChange?.(page - 1)}
          disabled={!canGoBack}
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ‹ Prev
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange?.(page + 1)}
          disabled={!canGoForward}
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next ›
        </button>
        <button
          type="button"
          onClick={() => onPageChange?.(totalPages)}
          disabled={!canGoForward}
          className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Last »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
