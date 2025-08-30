import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { ALL_MEDIA } from "../mockdata/mockMedia";
import { isMediaSaved, saveMediaForUser, unsaveMediaForUser } from "../utils/saveMedia";

export default function RecommendationGrid() {
  const { user, updateUser } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedStates, setSavedStates] = useState({});

  // useCallback para memoizar a função
  const generateRecommendations = useCallback(() => {
    if (!user) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newRecommendations = [...ALL_MEDIA]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      
      setRecommendations(newRecommendations);
      setIsLoading(false);
    }, 300);
  }, [user]); // Dependências da função

  // Gerar recomendações iniciais
  useEffect(() => {
    if (user && recommendations.length === 0) {
      generateRecommendations();
    }
  }, [user, recommendations.length, generateRecommendations]); // Todas as dependências

  // Atualizar savedStates quando o user ou recomendações mudarem
  useEffect(() => {
    if (user && recommendations.length > 0) {
      const initialSavedStates = {};
      recommendations.forEach(media => {
        initialSavedStates[media.id] = isMediaSaved(user, media.id);
      });
      setSavedStates(initialSavedStates);
    }
  }, [user, recommendations]);

  const handleSaveMedia = async (mediaId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;

    const isCurrentlySaved = savedStates[mediaId];
    
    // Atualiza o estado visual imediatamente (otimista)
    setSavedStates(prev => ({
      ...prev,
      [mediaId]: !isCurrentlySaved
    }));

    try {
      const updatedUser = isCurrentlySaved
        ? unsaveMediaForUser(user, mediaId)
        : saveMediaForUser(user, mediaId);

      updateUser(updatedUser);
      
    } catch {
      // Revert em caso de erro
      setSavedStates(prev => ({
        ...prev,
        [mediaId]: isCurrentlySaved
      }));
      alert("Erro ao salvar mídia");
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-5xl mt-10">
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-2xl p-4 animate-pulse">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {recommendations.map((media) => {
            const isSaved = savedStates[media.id] || false;
            
            return (
              <Link
                key={media.id}
                to={`/media/${media.id}`}
                className="block bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition relative group"
              >
                <button
                  onClick={(e) => handleSaveMedia(media.id, e)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
                    isSaved
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  title={isSaved ? 'Remover dos salvos' : 'Salvar para depois'}
                >
                  <svg 
                    className="w-4 h-4" 
                    fill={isSaved ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                    />
                  </svg>
                </button>

                <div className="w-full h-32 mb-3 overflow-hidden rounded-lg">
                  <img
                    src={media.image}
                    alt={media.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">
                    {media.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {media.type}
                    </span>
                    {media.rating && (
                      <span className="text-xs text-yellow-600 font-semibold">
                        ⭐ {media.rating}
                      </span>
                    )}
                  </div>
                  {media.year && (
                    <p className="text-xs text-gray-500 mt-2">
                      {media.year}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma recomendação disponível no momento.</p>
          <button
            onClick={generateRecommendations}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Gerar Recomendações
          </button>
        </div>
      )}
    </div>
  );
}