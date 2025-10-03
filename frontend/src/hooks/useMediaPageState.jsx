import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchMediaFiltered } from "../services/mediaService";

/**
 * Hook genérico para páginas de mídia com paginação, busca e ordenação.
 * @param {string} type Tipo de mídia ("GAME", "MOVIE", "MUSIC", "SERIES", "BOOK")
 * @param {number} itemsPerPage Número de itens por página
 * @returns {object} { items, currentPage, totalPages, searchQuery, sortBy, setPage, setSearchOrSort }
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

  // Atualiza a URL
  const updateParams = (page, query, sort) => {
    const params = {};
    if (page > 1) params.page = page;
    if (query) params.q = query;
    if (sort && sort !== "rating") params.sort = sort;
    setSearchParams(params);
  };

  // Efeito para carregar dados da API
  useEffect(() => {
    async function loadItems() {
      const data = await fetchMediaFiltered({
        type,
        search: searchQuery,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });
      setItems(data.media || []);
      setTotalPages(data.pagination?.pages || 1);
    }
    loadItems();
  }, [type, currentPage, searchQuery, sortBy, itemsPerPage]);

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

  return {
    items,
    currentPage,
    totalPages,
    searchQuery,
    sortBy,
    setPage,
    setSearchOrSort,
  };
}
