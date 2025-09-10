import { useState, useMemo } from "react";
import Pagination from "../../components/Pagination";
import MediaGrid from "../../components/contents/MediaGrid";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import { MediaType } from "../../models/MediaType";
import { getMediaByType } from "../../utils/MediaHelpers";

export default function BooksPage() {
  const allBooks = getMediaByType(MediaType.BOOK);
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredAndSortedBooks = useMemo(() => {
    let books = allBooks;

    // Pesquisa por título
    if (searchQuery.trim() !== "") {
      books = books.filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenação rápida
    if (sortBy === "title") {
      books = [...books].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      books = [...books].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "year") {
      books = [...books].sort((a, b) => b.year - a.year);
    }

    return books;
  }, [allBooks, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const booksToShow = filteredAndSortedBooks.slice(startIdx, endIdx);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Livros</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MediaGrid items={booksToShow} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
