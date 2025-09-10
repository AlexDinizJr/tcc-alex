import { useState } from "react";
import FilterSection from "../../components/recommendations/FilterSection";
import ReferenceMediaGrid from "../../components/recommendations/ReferenceMediaGrid";
import ResultsGrid from "../../components/recommendations/ResultsGrid";
import MediaSearchModal from "../../components/recommendations/MediaSearchModal";
import { useRecommendationFilters } from "../../hooks/useRecommendationFilters";
import { ALL_MEDIA } from "../../mockdata/mockMedia";

export default function CustomRecommendations() {
  const [filters, setFilters] = useState({
    types: [],
    genres: [],
    minYear: "",
    maxYear: "",
    minRating: "",
    platforms: [],
    classifications: []
  });
  
  const [referenceMedia, setReferenceMedia] = useState([null, null, null]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { mediaTypes, genres, platforms, classifications } = useRecommendationFilters();

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

  const openMediaSearch = (slotIndex) => {
    setCurrentSlot(slotIndex);
    setShowSearchModal(true);
  };

  const handleMediaSelect = (media) => {
    const newReferenceMedia = [...referenceMedia];
    newReferenceMedia[currentSlot] = media;
    setReferenceMedia(newReferenceMedia);
    setShowSearchModal(false);
  };

  const removeReferenceMedia = (slotIndex) => {
    const newReferenceMedia = [...referenceMedia];
    newReferenceMedia[slotIndex] = null;
    setReferenceMedia(newReferenceMedia);
  };

  const generateRecommendations = async () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        let filteredPool = [...ALL_MEDIA];

        if (filters.types.length > 0) {
          filteredPool = filteredPool.filter(m => filters.types.includes(m.type.toString()));
        }
        
        if (filters.genres.length > 0) {
          filteredPool = filteredPool.filter(m => 
            m.genres && m.genres.some(genre => filters.genres.includes(genre.toString()))
          );
        }

        if (filters.classifications.length > 0) {
          filteredPool = filteredPool.filter(m => 
            filters.classifications.includes(m.classification)
          );
        }
        
        const minYearNum = parseInt(filters.minYear);
        if (!isNaN(minYearNum)) filteredPool = filteredPool.filter(m => m.year >= minYearNum);
        
        const maxYearNum = parseInt(filters.maxYear);
        if (!isNaN(maxYearNum)) filteredPool = filteredPool.filter(m => m.year <= maxYearNum);
        
        const minRatingNum = parseFloat(filters.minRating);
        if (!isNaN(minRatingNum)) filteredPool = filteredPool.filter(m => m.rating >= minRatingNum);
        
        if (filters.platforms.length > 0) {
          filteredPool = filteredPool.filter(m =>
            m.streamingLinks?.some(s => filters.platforms.includes(s.service))
          );
        }

        const activeReferences = referenceMedia.filter(r => r !== null);
        if (activeReferences.length > 0) {
          filteredPool = filteredPool.filter(m => {
            return activeReferences.some(ref => {
              const sameType = m.type === ref.type;
              const hasCommonGenres = m.genres && ref.genres && 
                m.genres.some(genre => ref.genres.includes(genre));
              return sameType || hasCommonGenres;
            });
          });
        }

        const finalRecommendations = applyTestAlgorithm(filteredPool);
        setRecommendations(finalRecommendations);
      } catch (error) {
        console.error('Erro ao gerar recomendações:', error);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const applyTestAlgorithm = (filteredPool) => {
    if (filteredPool.length === 0) return [];
    if (filteredPool.length <= 5) return filteredPool;
    return [...filteredPool].sort(() => 0.5 - Math.random()).slice(0, 5);
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
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho e Filtros */}
        <div className="bg-gray-800/80 rounded-2xl border border-gray-700/50 shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Recomendações Personalizadas
          </h1>
          <p className="text-gray-300 mb-8">
            Configure suas preferências para receber recomendações sob medida
          </p>

          {/* Aviso de filtros */}
          <div className="bg-blue-900/40 border border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-100">
                  Dica para melhores recomendações
                </h3>
                <div className="mt-2 text-sm text-blue-200">
                  <p>
                    ⚠️ <strong>Cuidado com filtros muito específicos!</strong> Combinar muitos critérios 
                    restritivos (como ano + gênero + plataforma + avaliação) pode limitar demais as opções.
                  </p>
                  <p className="mt-2">
                    💡 <strong>Sugestão:</strong> Comece com filtros mais amplos e vá refinando 
                    gradualmente.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-400 bg-gray-700/70"
                    />
                    <span className="ml-2 text-sm text-white capitalize">{type}</span>
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
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-400 bg-gray-700/70"
                    />
                    <span className="ml-2 text-sm text-white">{genre}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Classificação Etária">
              <div className="space-y-2">
                {classifications.map(cl => (
                  <label key={cl} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.classifications.includes(cl)}
                      onChange={() => handleFilterChange("classifications", cl)}
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-400 bg-gray-700/70"
                    />
                    <span className="ml-2 text-sm text-white">{cl}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Ano">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Ano mínimo</label>
                  <input
                    type="number"
                    placeholder="Ex: 1990"
                    value={filters.minYear}
                    onChange={e => handleFilterChange("minYear", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm bg-gray-700/70 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Ano máximo</label>
                  <input
                    type="number"
                    placeholder="Ex: 2023"
                    value={filters.maxYear}
                    onChange={e => handleFilterChange("maxYear", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm bg-gray-700/70 text-white"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Avaliação Mínima">
              <div>
                <select
                  value={filters.minRating}
                  onChange={e => handleFilterChange("minRating", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm bg-gray-700/70 text-white"
                >
                  <option value="">Qualquer avaliação</option>
                  <option value="3.0">⭐ 3.0+ (Bom)</option>
                  <option value="3.5">⭐ 3.5+ (Muito Bom)</option>
                  <option value="4.0">⭐ 4.0+ (Excelente)</option>
                  <option value="4.5">⭐ 4.5+ (Excepcional)</option>
                </select>
                <p className="text-xs text-gray-300 mt-2">Selecione a avaliação mínima desejada</p>
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
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-400 bg-gray-700/70"
                    />
                    <span className="ml-2 text-sm text-white">{platform}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Mídias de Referência */}
          <ReferenceMediaGrid
            referenceMedia={referenceMedia}
            onOpenMediaSearch={openMediaSearch}
            onRemoveReferenceMedia={removeReferenceMedia}
          />

          {/* Botão de Gerar Recomendações */}
          <button
            onClick={generateRecommendations}
            disabled={!hasFilters || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-2xl hover:bg-blue-500 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Gerando recomendações...
              </span>
            ) : (
              "Gerar Recomendações Personalizadas"
            )}
          </button>
        </div>

        {/* Resultados */}
        <ResultsGrid
          recommendations={recommendations}
          isLoading={isLoading}
          hasFilters={hasFilters}
        />

        {/* Modal de Busca de Mídias */}
        <MediaSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelect={handleMediaSelect}
        />
      </div>
    </div>
  );
}
