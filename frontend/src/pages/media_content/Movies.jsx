import { useState, useEffect } from "react";
import { fetchMediaFiltered } from "../../services/mediaService";
import MediaGrid from "../../components/contents/MediaGrid";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";

export default function MoviesPage() {
  const itemsPerPage = 20;
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    async function loadMovies() {
      const data = await fetchMediaFiltered({
        type: "MOVIE",
        search: searchQuery,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });
      setMovies(data.media || []);
      setTotalPages(data.pagination?.pages || 1);
    }
    loadMovies();
  }, [currentPage, searchQuery, sortBy]);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Filmes</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MediaGrid items={movies} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
