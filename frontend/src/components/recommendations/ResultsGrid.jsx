import MediaCarouselCard from "../MediaCarouselCard";

export default function ResultsGrid({ recommendations = [], isLoading, hasFilters }) {

  const recommendationsArray = Array.isArray(recommendations) ? recommendations : [];

  if (!hasFilters && !isLoading) return null;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Gerando recomendações...</p>
      </div>
    );
  }

  if (recommendationsArray.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-4">Nenhuma recomendação encontrada.</p>
    );
  }

  return (
    <div className="bg-gray-800/80 rounded-2xl border border-gray-700/50 shadow-md p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Suas Recomendações Personalizadas ({recommendationsArray.length})
      </h2>
      
      {/* Carrossel horizontal */}
      <div className="flex overflow-visible pb-4 gap-4 justify-center">
        {recommendationsArray.map((media) => (
          <MediaCarouselCard 
            key={media.id}
            media={media}
          />
        ))}
      </div>
    </div>
  );
}