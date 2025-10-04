import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMediaFiltered } from "../services/mediaService";

/**
 * Hook genérico para páginas de mídia com paginação, busca, ordenação e filtros.
 * @param {string} type Tipo de mídia ("GAME", "MOVIE", "MUSIC", "SERIES", "BOOK")
 * @param {number} itemsPerPage Número de itens por página
 */
export function useMediaPageState(type, itemsPerPage = 30) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Inicializa estados a partir da URL
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialQuery = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "rating";

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState(initialSort);

  // Filtros
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // Atualiza a URL
  const updateParams = (page, query, sort) => {
    const params = {};
    if (page > 1) params.page = page;
    if (query) params.q = query;
    if (sort && sort !== "rating") params.sort = sort;
    setSearchParams(params);
  };

  // Carrega dados da API
  const loadItems = async () => {
    const data = await fetchMediaFiltered({
      type,
      search: searchQuery,
      sortBy,
      page: currentPage,
      limit: itemsPerPage,
      year: selectedYear || undefined,
      classification: selectedClassification || undefined,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
    });

    setItems(data.media || []);
    setTotalPages(data.pagination?.pages || 1);
  };

  // Sempre que algum estado mudar, recarrega os itens
  useEffect(() => {
    loadItems();
  }, [
    type,
    currentPage,
    searchQuery,
    sortBy,
    itemsPerPage,
    selectedYear,
    selectedClassification,
    selectedGenres,
    selectedPlatforms,
  ]);

  // Funções para atualizar estado e URL
  const setPage = (page) => {
    setCurrentPage(page);
    updateParams(page, searchQuery, sortBy);
  };

  const setSearchOrSort = (query, sort, page = 1) => {
    setSearchQuery(query);
    setSortBy(sort);
    setCurrentPage(page);
    updateParams(page, query, sort);
  };

  // Aplica filtros do MediaPageHeader
  const applyFilters = ({ year, classification, genres, platforms }) => {
    setSelectedYear(year || "");
    setSelectedClassification(classification || "");
    setSelectedGenres(genres || []);
    setSelectedPlatforms(platforms || []);
    setCurrentPage(1); // resetar página ao aplicar filtros
  };

  return {
    items,
    currentPage,
    totalPages,
    searchQuery,
    sortBy,
    setPage,
    setSearchOrSort,
    selectedYear,
    selectedClassification,
    selectedGenres,
    selectedPlatforms,
    setSelectedYear,
    setSelectedClassification,
    setSelectedGenres,
    setSelectedPlatforms,
    applyFilters, // 🔹 função para aplicar filtros
  };
}