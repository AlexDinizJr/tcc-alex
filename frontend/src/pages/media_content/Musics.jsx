import { useState, useEffect } from "react";
import { fetchMediaFiltered } from "../../services/mediaService";
import MediaCarousel from "../../components/MediaCarousel";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";

export default function MusicsPage() {
  const itemsPerPage = 30;
  const [musics, setMusics] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    async function loadMusics() {
      const data = await fetchMediaFiltered({
        type: "MUSIC",
        search: searchQuery,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });
      setMusics(data.media || []);
      setTotalPages(data.pagination?.pages || 1);
    }
    loadMusics();
  }, [currentPage, searchQuery, sortBy]);

  const handleSearchOrSortChange = (query, sort, page = 1) => {
    setSearchQuery(query);
    setSortBy(sort);
    setCurrentPage(page);
  };

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Músicas</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onSearchOrSortChange={handleSearchOrSortChange}
        currentPage={currentPage}
      />

      <MediaCarousel items={musics} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}