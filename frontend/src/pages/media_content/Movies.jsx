import { useState, useMemo } from "react";
import Pagination from "../../components/Pagination";
import MediaGrid from "../../components/contents/MediaGrid";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import { MediaType } from "../../models/MediaType";
import { getMediaByType } from "../../utils/MediaHelpers";

export default function MoviesPage() {
  const allMovies = getMediaByType(MediaType.MOVIE);
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredAndSortedMovies = useMemo(() => {
    let movies = allMovies;

    // Pesquisa por título
    if (searchQuery.trim() !== "") {
      movies = movies.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenação rápida
    if (sortBy === "title") {
      movies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      movies = [...movies].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "year") {
      movies = [...movies].sort((a, b) => b.year - a.year);
    }

    return movies;
  }, [allMovies, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedMovies.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const moviesToShow = filteredAndSortedMovies.slice(startIdx, endIdx);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Filmes</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MediaGrid items={moviesToShow} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
