"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/search?${params.toString()}`);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        &lt;
      </button>
      
      <span className="pagination-current">{currentPage}</span>
      
      <span className="pagination-ellipsis">...</span>
      
      <span className="pagination-total">{totalPages}</span>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
