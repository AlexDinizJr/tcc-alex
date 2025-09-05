import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import MediaPageHeader from "../components/MediaPageHeader";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import { convertMediaIdsToObjects } from "../utils/MediaHelpers";

export default function MyFavorites() {
  const { user } = useAuth();
  const allFavorites = convertMediaIdsToObjects(user?.favorites || []);
  const itemsPerPage = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredAndSortedFavorites = useMemo(() => {
    let items = [...allFavorites];

    if (searchQuery.trim() !== "") {
      items = items.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "title") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "year") {
      items.sort((a, b) => b.year - a.year);
    }

    return items;
  }, [allFavorites, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedFavorites.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const favoritesToShow = filteredAndSortedFavorites.slice(startIdx, endIdx);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Favoritos</h1>
          <p className="text-gray-600">{allFavorites.length} favoritos</p>
        </div>

        <MediaPageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={["title", "rating", "year"]}
          searchPlaceholder="Pesquisar favoritos..."
        />

        <MediaGrid 
          items={favoritesToShow}
          emptyMessage="Você ainda não favoritou nenhum item."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
