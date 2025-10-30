import MediaCarousel from "../../components/MediaCarousel";
import MediaPageHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { useMediaPageState } from "../../hooks/useMediaPageState";
import HeroHeader from "../../components/sections/HeroHeader";

/**
 * Componente genérico para página de mídia
 * @param {string} type Tipo de mídia: "MOVIE", "GAME", "MUSIC", etc.
 * @param {string} title Título exibido na página
 * @param {string} overlayImage URL da imagem de fundo opcional
 */
function MediaPage({ type, title, overlayImage }) {
  const mediaPage = useMediaPageState(type, 20);

  const dynamicBg = overlayImage || (mediaPage.items[0]?.image || "");

  return (
    <div className="relative min-h-screen px-4 py-8">
      <div className="relative z-10 max-w-6xl mx-auto text-white">
        <HeroHeader
          title={title}
          items={mediaPage.items}
          totalItems={mediaPage.totalItems}
          sortBy={mediaPage.sortBy}
          onChangeSort={(val) => mediaPage.setSearchOrSort(mediaPage.searchQuery, val, 1)}
          backgroundImage={dynamicBg}
        />

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
    </div>
  );
}

// Páginas específicas com fundo customizado
export function MoviesPage() {
  return (
    <MediaPage
      type="MOVIE"
      title="Filmes"
      overlayImage=""
    />
  );
}

export function GamesPage() {
  return (
    <MediaPage
      type="GAME"
      title="Games"
      overlayImage=""
    />
  );
}

export function MusicsPage() {
  return (
    <MediaPage
      type="MUSIC"
      title="Músicas"
      overlayImage=""
    />
  );
}

export function BooksPage() {
  return (
    <MediaPage
      type="BOOK"
      title="Livros"
      overlayImage=""
    />
  );
}

export function TVSeriesPage() {
  return (
    <MediaPage
      type="SERIES"
      title="Séries"
      overlayImage=""
    />
  );
}