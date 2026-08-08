import React from 'react';

/** WHY: A single reusable pagination control shared by every paged list
 * (job search, my applications, applicants, recruiter jobs, admin lists). */
export default function Pagination({ pageNumber, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
      <ul className="pagination">
        <li className={`page-item ${pageNumber === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(pageNumber - 1)}>Previous</button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === pageNumber ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(p)}>{p + 1}</button>
          </li>
        ))}
        <li className={`page-item ${pageNumber === totalPages - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(pageNumber + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  );
}
