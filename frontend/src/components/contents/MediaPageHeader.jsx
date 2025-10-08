import { useState, useEffect } from "react";
import { FiFilter, FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GrAscend } from "react-icons/gr";
import GenreFilterSection from "../recommendations/GenreFilterSection";
import { useRecommendationFilters } from "../../hooks/useRecommendationFilters";

export default function MediaPageHeader({
  searchQuery,
  sortBy,
  setSearchOrSort,
  currentPage,
  selectedYear,
  selectedClassification,
  selectedGenres,
  selectedPlatforms,
  applyFilters,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempClassification, setTempClassification] = useState(selectedClassification);
  const [tempGenres, setTempGenres] = useState(selectedGenres || []);
  const [tempPlatforms, setTempPlatforms] = useState(selectedPlatforms || []);

  const { genres, years, classifications, loading } = useRecommendationFilters();

  const sortOptions = [
    { label: "Título", value: "title" },
    { label: "Avaliação", value: "rating" },
    { label: "Ano de lançamento", value: "year" },
    { label: "Popularidade", value: "popular" },
    { label: "Recente", value: "newest" },
  ];

  const handleOptionClick = (value) => {
    setIsDropdownOpen(false);
    setSearchOrSort(searchQuery, value, 1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const pageToUse = value.trim() === "" ? currentPage : 1;
    setSearchOrSort(value, sortBy, pageToUse);
  };

  const toggleGenre = (genre) => {
    setTempGenres(tempGenres.includes(genre)
      ? tempGenres.filter(g => g !== genre)
      : [...tempGenres, genre]);
  };

  useEffect(() => {
    if (showFilters) {
      setTempYear(selectedYear);
      setTempClassification(selectedClassification);
      setTempGenres(selectedGenres || []);
      setTempPlatforms(selectedPlatforms || []);
    }
  }, [showFilters, selectedYear, selectedClassification, selectedGenres, selectedPlatforms]);

  return (
    <div className="bg-gray-900/90 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8 transition-all duration-300">
      {/* Busca + Ordenação + Filtros */}
      <div className="flex flex-col w-full md:w-auto md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 min-w-0 px-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-2xl border border-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <GrAscend /> {sortOptions.find(opt => opt.value === sortBy)?.label || "Selecione"}
            {isDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 sm:right-0 left-0 mx-4 mt-2 w-auto max-w-xs sm:w-52 bg-gray-800/95 text-white border border-gray-700 rounded-2xl shadow-lg z-10 animate-fadeIn">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors ${
                    sortBy === option.value ? "bg-blue-700" : ""
                  }`}
                >
                  {option.label}
                  {sortBy === option.value && <FiCheck />}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-2xl border border-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
        >
          {showFilters ? <IoMdCloseCircleOutline /> : <FiFilter />}
        </button>
      </div>

      {/* Painel de filtros */}
      {showFilters && !loading && (
        <div className="mt-6 space-y-6 bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-inner animate-fadeIn">
          {/* Ano */}
          <div>
            <h3 className="text-white font-medium mb-2">Ano de lançamento</h3>
            <select
              value={tempYear || ""}
              onChange={(e) => setTempYear(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            >
              <option value="">Todos</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          {/* Classificação */}
          <div>
            <h3 className="text-white font-medium mb-2">Classificação</h3>
            <select
              value={tempClassification || ""}
              onChange={(e) => setTempClassification(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
            >
              <option value="">Todas</option>
              {classifications.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Gêneros */}
          <div>
            <h3 className="text-white font-medium mb-2">Gêneros</h3>
            <GenreFilterSection
              genres={genres}
              selectedGenres={tempGenres}
              onGenreChange={toggleGenre}
              label="gênero"
            />
          </div>

          {/* Botão aplicar */}
          <div className="flex justify-center sm:justify-end mt-4">
            <button
              onClick={() => {
                setShowFilters(false);

                applyFilters({
                  year: tempYear,
                  classification: tempClassification,
                  genres: tempGenres,
                  platforms: tempPlatforms,
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
