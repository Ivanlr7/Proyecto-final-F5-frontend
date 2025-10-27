
import React from "react";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange, className = "" }) {
  return (
    <div className={`pagination ${className}`.trim()}>
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Anterior
      </button>
      <span className="pagination__info">
        Página {currentPage} de {totalPages}
      </span>
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente →
      </button>
    </div>
  );
}

export default Pagination;
