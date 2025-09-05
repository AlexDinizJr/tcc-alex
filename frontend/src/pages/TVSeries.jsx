import React, { useState } from "react";
import MediaGrid from "../components/MediaGrid";
import Pagination from "../components/Pagination";
import MediaPageHeader from "../components/MediaPageHeader";
import { MediaType } from "../models/MediaType";
import { getMediaByType } from "../utils/MediaHelpers";

export default function TVSeriesPage() {
  const allSeries = getMediaByType(MediaType.SERIES);
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(""); // ordenação rápida

  const totalPages = Math.ceil(allSeries.length / itemsPerPage);

  // Filtra pelo texto digitado
  let filteredSeries = allSeries.filter(series =>
    series.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Ordenação rápida
  if (sortBy === "title") {
    filteredSeries.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "year") {
    filteredSeries.sort((a, b) => b.year - a.year);
  } else if (sortBy === "rating") {
    filteredSeries.sort((a, b) => b.rating - a.rating);
  }

  // Paginação
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const seriesToShow = filteredSeries.slice(startIdx, endIdx);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Séries</h2>

      <MediaPageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <MediaGrid items={seriesToShow} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}