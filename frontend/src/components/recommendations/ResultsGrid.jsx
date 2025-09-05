import MediaCarouselCard from "../MediaCarouselCard";

export default function ResultsGrid({ recommendations = [], isLoading, hasFilters }) {

  // Garantir que recommendations seja sempre um array
  const recommendationsArray = Array.isArray(recommendations) ? recommendations : [];

  if (!hasFilters && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Gerando recomendações...</p>
      </div>
    );
  }

  if (recommendationsArray.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-4">Nenhuma recomendação encontrada.</p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Suas Recomendações Personalizadas ({recommendationsArray.length})
      </h2>
      
      {/* Carrossel horizontal */}
      <div className="flex overflow-x-auto pb-4 gap-4 justify-center">
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