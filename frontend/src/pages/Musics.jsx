import React, { useState } from "react";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import MediaPageHeader from "../components/MediaPageHeader";
import { MediaType } from "../models/MediaType";
import { getMediaByType } from "../utils/MediaHelpers";

export default function MusicsPage() {
  const allMusics = getMediaByType(MediaType.MUSIC);
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title"); // "title", "year", "rating"
  
  // Filtra pelo nome
  const filteredMusics = allMusics.filter((music) =>
    music.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordena de acordo com o sortBy
  const sortedMusics = filteredMusics.sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "year") return b.year - a.year;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const musicsToShow = sortedMusics.slice(startIdx, endIdx);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Músicas</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MediaGrid items={musicsToShow} />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedMusics.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
