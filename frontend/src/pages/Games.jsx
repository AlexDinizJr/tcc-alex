import { useState, useMemo } from "react";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import MediaPageHeader from "../components/MediaPageHeader";
import { MediaType } from "../models/MediaType";
import { getMediaByType } from "../utils/MediaHelpers";

export default function GamesPage() {
  const allGames = getMediaByType(MediaType.GAME);
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredAndSortedGames = useMemo(() => {
    let games = allGames;

    // Pesquisa por título
    if (searchQuery.trim() !== "") {
      games = games.filter((g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenação rápida
    if (sortBy === "title") {
      games = [...games].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      games = [...games].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "year") {
      games = [...games].sort((a, b) => b.year - a.year);
    }

    return games;
  }, [allGames, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedGames.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const gamesToShow = filteredAndSortedGames.slice(startIdx, endIdx);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Games</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MediaGrid items={gamesToShow} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
