import { useState, useMemo } from "react";
import RecommendationGrid from "../components/RecommendationGrid";
import MediaSearchModal from "../components/recommendations/MediaSearchModal";
import { ALL_MEDIA } from "../mockdata/mockMedia";
import { MediaType } from "../models/MediaType";
import { MediaGenre } from "../models/GenreModel";

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <span className="font-medium text-gray-700">{title}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function CustomRecommendations() {
  // Estados principais
  const [filters, setFilters] = useState({
    types: [],
    genres: [],
    minYear: "",
    maxYear: "",
    minRating: "",
    platforms: []
  });
  const [referenceMedia, setReferenceMedia] = useState([null, null, null]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Valores memoizados
  const mediaTypes = useMemo(
    () => Object.values(MediaType).filter(v => typeof v === "string").sort(),
    []
  );
  const genres = useMemo(
    () => Object.values(MediaGenre).filter(v => typeof v === "string").sort(),
    []
  );
  const platforms = useMemo(
    () => [
      ...new Set(
        ALL_MEDIA.flatMap(m => m.streamingLinks?.map(s => s.service) || [])
      )
    ],
    []
  );

  // Manipulação de filtros
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const newArray = prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value];
        return { ...prev, [filterType]: newArray };
      }
      return { ...prev, [filterType]: value };
    });
  };

  // Abertura do modal de seleção de mídia
  const openMediaSearch = slotIndex => {
    setCurrentSlot(slotIndex);
    setShowSearchModal(true);
  };

  const handleMediaSelect = media => {
    const newReferenceMedia = [...referenceMedia];
    newReferenceMedia[currentSlot] = media;
    setReferenceMedia(newReferenceMedia);
    setShowSearchModal(false);
  };

  const removeReferenceMedia = slotIndex => {
    const newReferenceMedia = [...referenceMedia];
    newReferenceMedia[slotIndex] = null;
    setReferenceMedia(newReferenceMedia);
  };

  // Geração de recomendações
  const generateRecommendations = async () => {
    setIsLoading(true);

    setTimeout(() => {
      let results = [...ALL_MEDIA];

      // Filtros
      if (filters.types.length > 0) {
        results = results.filter(m => filters.types.includes(m.type.toString()));
      }
      if (filters.genres.length > 0) {
        results = results.filter(m => 
          m.genres && m.genres.some(genre => filters.genres.includes(genre.toString()))
        );
      }
      const minYearNum = parseInt(filters.minYear);
      if (!isNaN(minYearNum)) results = results.filter(m => m.year >= minYearNum);
      const maxYearNum = parseInt(filters.maxYear);
      if (!isNaN(maxYearNum)) results = results.filter(m => m.year <= maxYearNum);
      const minRatingNum = parseFloat(filters.minRating);
      if (!isNaN(minRatingNum)) results = results.filter(m => m.rating >= minRatingNum);
      if (filters.platforms.length > 0) {
        results = results.filter(m =>
          m.streamingLinks?.some(s => filters.platforms.includes(s.service))
        );
      }

      // Filtro baseado nas mídias de referência
      const activeReferences = referenceMedia.filter(r => r !== null);
      if (activeReferences.length > 0) {
        results = results.filter(m =>
          activeReferences.some(ref =>
            m.type === ref.type || 
            (m.genres && ref.genres && m.genres.some(genre => ref.genres.includes(genre)))
          )
        );
      }

      setRecommendations(results);
      setIsLoading(false);
    }, 1000);
  };

  const hasFilters =
    filters.types.length > 0 ||
    filters.genres.length > 0 ||
    filters.minYear ||
    filters.maxYear ||
    filters.minRating ||
    filters.platforms.length > 0 ||
    referenceMedia.some(media => media !== null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Recomendações Personalizadas
          </h1>
          <p className="text-gray-600 mb-8">
            Configure suas preferências para receber recomendações sob medida
          </p>

          {/* Filtros */}
          <div className="space-y-4 mb-8">
            <FilterSection title="Tipos de Mídia">
              <div className="space-y-2">
                {mediaTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleFilterChange("types", type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Gêneros">
              <div className="space-y-2">
                {genres.map(genre => (
                  <label key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.genres.includes(genre)}
                      onChange={() => handleFilterChange("genres", genre)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{genre}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Ano e Avaliação">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Ano mín."
                    value={filters.minYear}
                    onChange={e => handleFilterChange("minYear", e.target.value)}
                    className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Ano máx."
                    value={filters.maxYear}
                    onChange={e => handleFilterChange("maxYear", e.target.value)}
                    className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filters.minRating}
                  onChange={e => handleFilterChange("minRating", e.target.value)}
                  className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full"
                >
                  <option value="">Qualquer avaliação</option>
                  <option value="3.0">⭐ 3.0+</option>
                  <option value="3.5">⭐ 3.5+</option>
                  <option value="4.0">⭐ 4.0+</option>
                  <option value="4.5">⭐ 4.5+</option>
                </select>
              </div>
            </FilterSection>

            <FilterSection title="Plataformas">
              <div className="space-y-2">
                {platforms.map(platform => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.platforms.includes(platform)}
                      onChange={() => handleFilterChange("platforms", platform)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Mídias de Referência */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Mídias de Referência (opcional)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {referenceMedia.map((media, index) => (
                <div key={index} className="text-center">
                  {media ? (
                    <div className="relative">
                      <img
                        src={media.image}
                        alt={media.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {media.title}
                      </p>
                      <button
                        onClick={() => removeReferenceMedia(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openMediaSearch(index)}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-2xl text-gray-400">+</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botão de Gerar Recomendações */}
          <button
            onClick={generateRecommendations}
            disabled={!hasFilters || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Gerando recomendações...
              </span>
            ) : (
              "🎯 Gerar Recomendações Personalizadas"
            )}
          </button>
        </div>

        {/* Resultados */}
        {hasFilters && !isLoading && recommendations.length === 0 && (
          <p className="text-gray-500 text-center mt-4">Nenhuma recomendação encontrada.</p>
        )}

        {recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Suas Recomendações Personalizadas ({recommendations.length})
            </h2>
            <RecommendationGrid recommendations={recommendations} />
          </div>
        )}

        {/* Modal de Busca de Mídias - USANDO O NOVO COMPONENTE */}
        <MediaSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelect={handleMediaSelect}
        />
      </div>
    </div>
  );
}