import MediaCarousel from "../../components/MediaCarousel";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { useMediaPageState } from "../../hooks/useMediaPageState";

/**
 * Componente genérico para página de mídia
 * @param {string} type Tipo de mídia: "MOVIE", "GAME", "MUSIC", etc.
 * @param {string} title Título exibido na página
 */
function MediaPage({ type, title }) {
  const mediaPage = useMediaPageState(type, 30);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <MediaPageHeader
        searchQuery={mediaPage.searchQuery}
        sortBy={mediaPage.sortBy}
        setSearchOrSort={mediaPage.setSearchOrSort}
        currentPage={mediaPage.currentPage}

        selectedYear={mediaPage.selectedYear}
        selectedClassification={mediaPage.selectedClassification}
        selectedGenres={mediaPage.selectedGenres}
        selectedPlatforms={mediaPage.selectedPlatforms}

        applyFilters={mediaPage.applyFilters}
      />

      <MediaCarousel items={mediaPage.items} sortBy={mediaPage.sortBy} />

      <Pagination
        currentPage={mediaPage.currentPage}
        totalPages={mediaPage.totalPages}
        onPageChange={mediaPage.setPage}
      />
    </div>
  );
}

// Páginas específicas
export function MoviesPage() {
  return <MediaPage type="MOVIE" title="Filmes" />;
}

export function GamesPage() {
  return <MediaPage type="GAME" title="Games" />;
}

export function MusicsPage() {
  return <MediaPage type="MUSIC" title="Músicas" />;
}

export function BooksPage() {
  return <MediaPage type="BOOK" title="Livros" />;
}

export function TVSeriesPage() {
  return <MediaPage type="SERIES" title="Séries de TV" />;
}
