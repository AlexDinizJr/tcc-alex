import { useState, useMemo } from "react";
import { ALL_MEDIA } from "../../mockdata/mockMedia";
import { MediaType } from "../../models/MediaType";

export default function MediaSearchModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filteredMedia = useMemo(() => {
    let results = ALL_MEDIA;

    if (searchTerm) {
      results = results.filter(media =>
        media.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      results = results.filter(media => media.type === selectedType);
    }

    return results;
  }, [searchTerm, selectedType]);

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
    <div className="bg-gray-800/80 rounded-2xl w-full max-w-2xl p-4 relative max-h-[80vh] overflow-y-auto shadow-md">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-white z-10 bg-gray-700/60 rounded-full p-1 transition-colors"
      >
        ✕
      </button>

      <h3 className="text-lg font-semibold mb-4 text-white">Selecionar Mídia de Referência</h3>

      {/* Barra de pesquisa */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar mídias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-gray-700/70 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filtro por tipo */}
      <div className="mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full p-2 bg-gray-700/70 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os tipos</option>
          {Object.values(MediaType)
            .filter(v => typeof v === "string")
            .map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
      </div>

      {/* Lista de resultados */}
      <div className="space-y-3">
        {filteredMedia.map(media => (
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
                {media.type} • {media.year}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <p className="text-center text-gray-400 py-4">
          Nenhuma mídia encontrada
        </p>
      )}
    </div>
  </div>
  );
}