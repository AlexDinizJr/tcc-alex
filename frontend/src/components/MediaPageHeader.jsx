import React, { useState } from "react";

export default function MediaPageHeader({ searchQuery, setSearchQuery, sortBy, setSortBy }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { label: "Título", value: "title" },
    { label: "Avaliação", value: "rating" },
    { label: "Ano de lançamento", value: "year" },
  ];

  const handleOptionClick = (value) => {
    setSortBy(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
      {/* Barra de pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Botão Pin com dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2 bg-gray-100 rounded-full border border-gray-300 hover:bg-blue-500 hover:text-white transition-colors"
        >
          Ordenar por: {sortOptions.find(opt => opt.value === sortBy)?.label || "Selecione"}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                  sortBy === option.value ? "bg-blue-100" : ""
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
