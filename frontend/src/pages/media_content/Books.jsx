import MediaCarousel from "../../components/MediaCarousel";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { useMediaPageState } from "../../hooks/useMediaPageState";

export default function BooksPage() {
  const {
    items: books,
    currentPage,
    totalPages,
    searchQuery,
    sortBy,
    setPage,
    setSearchOrSort,
  } = useMediaPageState("BOOK", 30);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Livros</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={() => {}}
        sortBy={sortBy}
        setSortBy={() => {}}
        onSearchOrSortChange={setSearchOrSort}
        currentPage={currentPage}
      />

      <MediaCarousel items={books} sortBy={sortBy} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
