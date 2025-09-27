import { useState, useEffect, useCallback } from "react";
import MediaCarousel from "../MediaCarousel";
import { SlLike } from "react-icons/sl";
import { fetchUserRecommendations } from "../../services/recommendationService";

export default function RecommendationGrid() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchUserRecommendations({ limit: 5, algorithm: "content-based" });
      setRecommendations(() => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.recommendations)) return data.recommendations;
        if (Array.isArray(data?.data?.recommendations)) return data.data.recommendations;
        console.warn("⚠️ [FRONT] Nenhuma recomendação encontrada no payload:", data);
        return [];
      });
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
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Tratamento de erro */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Carousel centralizado */}
      {!isLoading && (
        <div className="w-full overflow-x-auto">
          <MediaCarousel items={recommendations} />
        </div>
      )}
    </div>
  );
}
