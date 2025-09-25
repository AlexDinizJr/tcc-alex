import { useState } from "react";

export default function MediaPageHeader({ searchQuery, setSearchQuery, sortBy, setSortBy, onSearchOrSortChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { label: "Título", value: "title" },
    { label: "Avaliação", value: "rating" },
    { label: "Ano de lançamento", value: "year" },
  ];

  const handleOptionClick = (value) => {
    setSortBy(value);
    setIsDropdownOpen(false);
    if (onSearchOrSortChange) onSearchOrSortChange(searchQuery, value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearchOrSortChange) onSearchOrSortChange(value, sortBy);
  };

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
      <input
        type="text"
        placeholder="Pesquisar..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="flex-1 px-3 py-2 bg-gray-800/80 text-white placeholder-gray-400 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="px-4 py-2 bg-gray-800/80 text-white rounded-full border border-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
        >
          Ordenar por: {sortOptions.find(opt => opt.value === sortBy)?.label || "Selecione"}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 text-white border border-gray-700 rounded-lg shadow-lg z-10">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                  sortBy === option.value ? "bg-blue-600" : ""
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
