import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="pagination-btn" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous Page"
      >
        <FiChevronLeft size={18} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button 
        className="pagination-btn" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next Page"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
