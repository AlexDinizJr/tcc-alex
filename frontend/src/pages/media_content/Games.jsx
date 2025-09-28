import { useState, useEffect } from "react";
import { fetchMediaFiltered } from "../../services/mediaService";
import MediaGrid from "../../components/contents/MediaGrid";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";

export default function GamesPage() {
  const itemsPerPage = 20;

  const [games, setGames] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Critério de ordenação: "rating" ou "title"
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    async function loadGames() {
      const data = await fetchMediaFiltered({
        type: "GAME",
        search: searchQuery,
        sortBy, // se sua API suportar, pode usar direto
        page: currentPage,
        limit: itemsPerPage,
      });

      let gamesData = data.media || [];

      // Ordena corretamente pelo rating ou título
      if (sortBy === "rating") {
        gamesData.sort((a, b) => {
          const ratingA = Number(a.rating) || 0;
          const ratingB = Number(b.rating) || 0;
          return ratingB - ratingA; // maior primeiro
        });
      } else if (sortBy === "title") {
        gamesData.sort((a, b) => a.title.localeCompare(b.title));
      }

      setGames(gamesData);
      setTotalPages(data.pagination?.pages || 1);

      // Scroll suave para o topo ao trocar de página
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    loadGames();
  }, [currentPage, searchQuery, sortBy]);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Games</h2>

      {/* Header com busca e dropdown de ordenação */}
      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={[
          { label: "Rating", value: "rating" },
          { label: "Título", value: "title" },
        ]}
      />

      {/* Grid de jogos */}
      <MediaGrid items={games} />

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}