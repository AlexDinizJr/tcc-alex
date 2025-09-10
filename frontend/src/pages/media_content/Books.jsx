import { useState, useEffect } from "react";
import { fetchMedia } from "../../services/mediaService";
import MediaGrid from "../../components/contents/MediaGrid";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { MediaType } from "../../models/MediaType";

export default function BooksPage() {
  const itemsPerPage = 20;
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    async function loadBooks() {
      const { items, total } = await fetchMedia({
        type: MediaType.BOOK,
        searchQuery,
        sortBy,
        page: currentPage,
        itemsPerPage
      });
      setBooks(items);
      setTotalPages(Math.ceil(total / itemsPerPage));
    }
    loadBooks();
  }, [searchQuery, sortBy, currentPage]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Livros</h2>
      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <MediaGrid items={books} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
