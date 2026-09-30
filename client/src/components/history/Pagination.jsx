import React from "react";
import { Button } from "../ui/Button.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, totalCount } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-stone-200 text-xs text-stone-500">
      <div>
        Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total advisories)
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>

        <span className="px-3 py-1 font-semibold text-stone-800 bg-stone-100 rounded-md">
          {page}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          icon={ChevronRight}
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
