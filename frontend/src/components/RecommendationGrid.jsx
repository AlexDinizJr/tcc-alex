import { ALL_MEDIA } from "../mockdata/mockMedia";
import MediaCarousel from "./MediaCarousel";
import { useState, useEffect, useCallback } from "react";

export default function RecommendationGrid() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      const recs = [...ALL_MEDIA].sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecommendations(recs);
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">✨ Recomendado para você</h2>
        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg 
            className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
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
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      <MediaCarousel items={recommendations} />
    </div>
  );
}
