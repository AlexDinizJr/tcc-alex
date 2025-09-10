import { useState, useEffect } from "react";
import { fetchMedia } from "../../services/mediaService";
import MediaGrid from "../../components/contents/MediaGrid";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { MediaType } from "../../models/MediaType";

export default function GamesPage() {
  const itemsPerPage = 20;
  const [games, setGames] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function loadGames() {
      const { items, total } = await fetchMedia({
        type: MediaType.GAME,
        searchQuery,
        sortBy,
        page: currentPage,
        itemsPerPage
      });
      setGames(items);
      setTotalPages(Math.ceil(total / itemsPerPage));
    }
    loadGames();
  }, [searchQuery, sortBy, currentPage]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Games</h2>
      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <MediaGrid items={games} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
