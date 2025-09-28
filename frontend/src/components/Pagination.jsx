export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Scroll para o topo ao trocar de página
  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFirst = () => handlePageChange(1);
  const handleLast = () => handlePageChange(totalPages);
  const handlePrev = () => handlePageChange(Math.max(1, currentPage - 1));
  const handleNext = () => handlePageChange(Math.min(totalPages, currentPage + 1));

  const getPageNumbers = () => {
    const pages = [];
    const visiblePages = 5; // número de páginas ao redor da atual
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + visiblePages - 1, totalPages);

    if (end - start + 1 < visiblePages) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    // primeira página
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // páginas do range
    for (let i = start; i <= end; i++) pages.push(i);

    // última página
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <button
        onClick={handleFirst}
        className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        «
      </button>
      <button
        onClick={handlePrev}
        className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        ‹
      </button>

      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <span
            key={index}
            className="px-3 py-1 text-gray-400 cursor-default select-none"
          >
            …
          </span>
        ) : (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              number === currentPage
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {number}
          </button>
        )
      )}

      <button
        onClick={handleNext}
        className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        ›
      </button>
      <button
        onClick={handleLast}
        className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
      >
        »
      </button>
    </div>
  );
}