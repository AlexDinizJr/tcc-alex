import { useState, useEffect } from "react";
import { fetchMedia } from "../../services/mediaService";
import MediaGrid from "../../components/contents/MediaGrid";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { MediaType } from "../../models/MediaType";

export default function MusicsPage() {
  const itemsPerPage = 20;
  const [musics, setMusics] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    async function loadMusics() {
      const { items, total } = await fetchMedia({
        type: MediaType.MUSIC,
        searchQuery,
        sortBy,
        page: currentPage,
        itemsPerPage
      });
      setMusics(items);
      setTotalPages(Math.ceil(total / itemsPerPage));
    }
    loadMusics();
  }, [searchQuery, sortBy, currentPage]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Músicas</h2>
      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <MediaGrid items={musics} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
