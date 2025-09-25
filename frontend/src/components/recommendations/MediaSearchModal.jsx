import { useState, useEffect } from "react";
import { searchMediaByQuery } from "../../services/mediaService";

export default function MediaSearchModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadMedia = async () => {
      if (!searchTerm.trim()) {
        setMediaList([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchMediaByQuery(searchTerm);
        setMediaList(data);
      } catch (err) {
        console.error("Erro ao carregar mídias:", err);
        setMediaList([]);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [isOpen, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white bg-gray-700/60 rounded-full p-1 transition-colors"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4 text-white">
          Buscar Mídias
        </h3>

        {/* Barra de pesquisa */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Digite o nome da mídia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Lista de resultados */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-400 py-4">Carregando...</p>
          ) : mediaList.length > 0 ? (
            mediaList.map(media => (
              <div
                key={media.id}
                onClick={() => onSelect(media)}
                className="flex items-center p-3 border border-gray-600/50 rounded-2xl hover:bg-gray-700/60 cursor-pointer transition-colors"
              >
                <img
                  src={media.image}
                  alt={media.title}
                  className="w-12 h-12 object-cover rounded-md mr-3"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{media.title}</h4>
                  <p className="text-sm text-gray-300">
                    {media.type} {media.year && `• ${media.year}`}
                  </p>
                </div>
              </div>
            ))
          ) : searchTerm.trim() ? (
            <p className="text-center text-gray-400 py-4">
              Nenhuma mídia encontrada para "{searchTerm}"
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}