import { useState, useEffect, useCallback } from "react";
import MediaCarousel from "../MediaCarousel";
import { SlLike } from "react-icons/sl";
import { fetchHomepageRecommendations } from "../../services/recommendationService";

export default function RecommendationGrid() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchHomepageRecommendations();
      setRecommendations(Array.isArray(data) ? data : data?.data || []);
    } catch {
      setError("Não foi possível carregar as recomendações.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  return (
    <div className="w-full max-w-[1500px] mx-auto mt-10 flex flex-col gap-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <SlLike className="w-6 h-6 text-blue-500" />
          Recomendado para você
        </h2>
        <button
          onClick={loadRecommendations}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isLoading ? "Carregando..." : "Atualizar"}
        </button>
      </div>

      {/* Tratamento de erro */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Carousel centralizado */}
      <div className="w-full overflow-x-auto">
        <MediaCarousel items={recommendations} />
      </div>
    </div>
  );
}
