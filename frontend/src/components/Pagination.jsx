import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // garante números
  const cp = Number(currentPage) || 1;
  const tp = Math.max(1, Number(totalPages) || 1);

  const handlePageChange = (page) => {
    if (page === "..." || page === "left-ellipsis" || page === "right-ellipsis") return;
    if (page < 1 || page > tp || page === cp) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFirst = () => handlePageChange(1);
  const handleLast = () => handlePageChange(tp);
  const handlePrev = () => handlePageChange(Math.max(1, cp - 1));
  const handleNext = () => handlePageChange(Math.min(tp, cp + 1));

  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 2; // número de páginas de cada lado da atual (total visível = 2*siblingCount + 1)
    const totalPageNumbers = siblingCount * 2 + 5; // inclui 1, last e possíveis dois "..."

    // Se há poucas páginas, mostra todas
    if (tp <= totalPageNumbers) {
      for (let i = 1; i <= tp; i++) pages.push(i);
      return pages;
    }

    const left = Math.max(2, cp - siblingCount);
    const right = Math.min(tp - 1, cp + siblingCount);

    // sempre mostra a primeira página
    pages.push(1);

    // decide se mostra elipse à esquerda ou números contínuos
    if (left > 2) {
      pages.push("left-ellipsis");
    } else {
      for (let i = 2; i < left; i++) pages.push(i);
    }

    // páginas centrais
    for (let i = left; i <= right; i++) pages.push(i);

    // decide se mostra elipse à direita ou números contínuos
    if (right < tp - 1) {
      pages.push("right-ellipsis");
    } else {
      for (let i = right + 1; i < tp; i++) pages.push(i);
    }

    // sempre mostra a última página
    pages.push(tp);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <button
        onClick={handleFirst}
        disabled={cp === 1}
        className={`px-3 py-1 rounded-lg transition-colors ${
          cp === 1 ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        }`}
        aria-label="Primeira página"
      >
        «
      </button>

      <button
        onClick={handlePrev}
        disabled={cp === 1}
        className={`px-3 py-1 rounded-lg transition-colors ${
          cp === 1 ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        }`}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {pageNumbers.map((item, idx) => {
        if (item === "left-ellipsis" || item === "right-ellipsis") {
          return (
            <span key={item + idx} className="px-3 py-1 text-gray-400 cursor-default select-none">
              …
            </span>
          );
        }

        return (
          <button
            key={item}
            onClick={() => handlePageChange(item)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              item === cp ? "bg-blue-700 text-white" : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }`}
            aria-current={item === cp ? "page" : undefined}
          >
            {item}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={cp === tp}
        className={`px-3 py-1 rounded-lg transition-colors ${
          cp === tp ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        }`}
        aria-label="Próxima página"
      >
        ›
      </button>

      <button
        onClick={handleLast}
        disabled={cp === tp}
        className={`px-3 py-1 rounded-lg transition-colors ${
          cp === tp ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
        }`}
        aria-label="Última página"
      >
        »
      </button>
    </div>
  );
}
