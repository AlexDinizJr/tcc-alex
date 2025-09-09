export default function ReferenceMediaGrid({ 
  referenceMedia = [], 
  onOpenMediaSearch, 
  onRemoveReferenceMedia 
}) {
  const safeReferenceMedia = Array.isArray(referenceMedia) ? referenceMedia : [];

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-300 mb-4">
        Mídias de Referência (opcional)
      </label>
      <div className="grid grid-cols-3 gap-4">
        {safeReferenceMedia.map((media, index) => (
          <div key={index} className="text-center">
            {media ? (
              <div className="relative bg-gray-800/70 rounded-2xl overflow-hidden shadow-md hover:shadow-white/20 transition-shadow">
                <img
                  src={media.image}
                  alt={media.title}
                  className="w-full h-32 object-cover rounded-t-2xl"
                />
                <p className="text-sm font-medium text-white line-clamp-1 mt-1 px-2">
                  {media.title}
                </p>
                <button
                  onClick={() => onRemoveReferenceMedia(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenMediaSearch(index)}
                className="w-full h-32 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center hover:border-blue-500 hover:bg-gray-700/50 text-gray-400 transition-colors"
              >
                <span className="text-2xl">+</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
