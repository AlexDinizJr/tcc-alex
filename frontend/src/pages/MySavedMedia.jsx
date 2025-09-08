import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import MediaPageHeader from "../components/MediaPageHeader";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import { convertMediaIdsToObjects } from "../utils/MediaHelpers";

export default function MySavedItems() {
  const { user } = useAuth();
  const allSavedMedia = convertMediaIdsToObjects(user?.savedMedia || []);
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredAndSortedMedia = useMemo(() => {
    let items = [...allSavedMedia];

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
  }, [allSavedMedia, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedMedia.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const savedMediaToShow = filteredAndSortedMedia.slice(startIdx, endIdx);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Itens Salvos</h1>
          <p className="text-gray-600">{allSavedMedia.length} itens salvos</p>
        </div>

        <MediaPageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={["title", "rating", "year"]}
          searchPlaceholder="Pesquisar itens salvos..."
        />

        <MediaGrid 
          items={savedMediaToShow}
          emptyMessage="Você ainda não salvou nenhum item."
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
