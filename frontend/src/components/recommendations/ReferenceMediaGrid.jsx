export default function ReferenceMediaGrid({ 
  referenceMedia = [], 
  onOpenMediaSearch, 
  onRemoveReferenceMedia 
}) {
  // Garantir que referenceMedia seja sempre um array válido
  const safeReferenceMedia = Array.isArray(referenceMedia) ? referenceMedia : [];
  
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Mídias de Referência (opcional)
      </label>
      <div className="grid grid-cols-3 gap-4">
        {safeReferenceMedia.map((media, index) => (
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
                  onClick={() => onRemoveReferenceMedia(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenMediaSearch(index)}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="text-2xl text-gray-400">+</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}