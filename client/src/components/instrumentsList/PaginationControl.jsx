import React from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';


function PaginationControls({ currentPage, totalPages, handlePrevPage, handleNextPage }) {
  // Fonction pour générer les liens de pagination
  const generatePageLinks = () => {
    const links = [];
    
    const displayPages = 2;

    
    links.push(
      <li key="prev">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded"
        >
          <ChevronLeftIcon className="w-3 h-3" />
        </button>
      </li>
    );

    
    for (let i = Math.max(0, currentPage - displayPages); i <= Math.min(currentPage + displayPages, totalPages - 1); i++) {
      links.push(
        <li key={i}>
          <a
            href={`/?page=${i + 1}`}
            className={`block w-8 h-8 text-center border border-gray-100 rounded leading-8 ${i === currentPage ? 'bg-orange-600 text-white' : ''}`}
          >
            {i + 1}
          </a>
        </li>
      );
    }

    
    links.push(
      <li key="next">
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded"
        >
          <ChevronRightIcon className="w-3 h-3" />
        </button>
      </li>
    );

    return links;
  };


  return (
    <ol className="flex justify-center text-xs font-medium space-x-1">
      {generatePageLinks()}
    </ol>
  );
}

export default PaginationControls;
