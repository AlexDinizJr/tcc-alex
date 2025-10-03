import { useState } from "react";
import FilterSection from "../../components/recommendations/FilterSection";
import ReferenceMediaGrid from "../../components/recommendations/ReferenceMediaGrid";
import ResultsGrid from "../../components/recommendations/ResultsGrid";
import MediaSearchModal from "../../components/recommendations/MediaSearchModal";
import GenreFilterSection from "../../components/recommendations/GenreFilterSection";
import { useRecommendationFilters } from "../../hooks/useRecommendationFilters";
import { searchMediaByQuery } from "../../services/mediaService";
import { fetchCustomRecommendations } from "../../services/recommendationService";
import { useAuth } from "../../hooks/useAuth"; // Adicione este hook

export default function CustomRecommendations() {
  const { user } = useAuth(); // Para pegar o userId
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
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    setIsLoading(true);
    setRecommendations([]);

    try {
      // Prepara os parâmetros para a API
      const params = {
        userId: user.id,
        types: filters.types.length > 0 ? filters.types : undefined,
        genres: filters.genres.length > 0 ? filters.genres : undefined,
        classifications: filters.classifications.length > 0 ? filters.classifications : undefined,
        minYear: filters.minYear || undefined,
        maxYear: filters.maxYear || undefined,
        minRating: filters.minRating || undefined,
        platforms: filters.platforms.length > 0 ? filters.platforms : undefined,
        referenceMediaIds: referenceMedia
          .filter(media => media !== null)
          .map(media => media.id),
        limit: 20 // Você pode ajustar conforme necessário
      };

      console.log("📤 Enviando parâmetros para API:", params);

      // Chama a API do backend
      const recommendationsArray = await fetchCustomRecommendations(params);
      setRecommendations(recommendationsArray);
      
      console.log("📥 Resposta da API:", recommendationsArray);

    } catch (error) {
      console.error('❌ Erro ao gerar recomendações:', error);
      setRecommendations([]);
      // Você pode adicionar um toast de erro aqui
    } finally {
      setIsLoading(false);
    }
  };

  const hasFilters =
    filters.types.length > 0 ||
    filters.genres.length > 0 ||
    filters.minYear ||
    filters.maxYear ||
    filters.minRating ||
    filters.platforms.length > 0 ||
    filters.classifications.length > 0 ||
    referenceMedia.some(media => media !== null);

  // Se você ainda precisa da busca de mídias para o modal, mantenha esta função
  const handleSearchMedia = async (query) => {
    try {
      const result = await searchMediaByQuery(query);
      return result.items || result.media || [];
    } catch (error) {
      console.error("Erro ao buscar mídias:", error);
      return [];
    }
  };

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
          <div className="flex flex-col gap-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-100">
                  Como funciona
                </h3>
                <div className="mt-2 text-sm text-blue-200">
                  <p>
                    🎯 <strong>Recomendações inteligentes:</strong> O sistema analisa suas preferências 
                    e mídias similares para sugerir conteúdo personalizado.
                  </p>
                  <p className="mt-2">
                    💡 <strong>Dica:</strong> Adicione mídias de referência para refinar ainda mais as recomendações.
                  </p>
                </div>
              </div>
            </div>

            {/* Novo aviso de testes */}
            <div className="flex items-start gap-2">
              <svg className="h-5 w-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.681-1.36 3.446 0l5.451 9.7c.75 1.335-.213 2.95-1.723 2.95H4.529c-1.51 0-2.473-1.615-1.723-2.95l5.451-9.7zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-yellow-200">
                Este recurso ainda está em <strong>teste</strong> e o funcionamento pode não ser 100% confiável.
              </p>
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
              <GenreFilterSection
                genres={genres}
                selectedGenres={filters.genres}
                onGenreChange={(genre) => handleFilterChange("genres", genre)}
              />
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

            {/* Plataformas */}
            <FilterSection title="Plataformas">
              <GenreFilterSection
                genres={platforms}
                selectedGenres={filters.platforms}
                onGenreChange={(platforms) => handleFilterChange("platforms", platforms)}
              />
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
            disabled={!hasFilters || isLoading || !user}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-2xl hover:bg-blue-500 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Gerando recomendações...
              </span>
            ) : !user ? (
              "Faça login para gerar recomendações"
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
          onSearch={handleSearchMedia} // Passe a função de busca se necessário
        />
      </div>
    </div>
  );
}