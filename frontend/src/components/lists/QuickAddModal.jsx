import { useState } from "react";
import ListSearchBar from "./ListSearchBar";

export default function QuickAddModal({ onClose, onAddItem, currentListItems }) {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const currentMediaObjects = currentListItems.map((item) =>
    typeof item === "object" ? item : { id: item }
  );

  const handleSearchResults = (results) => {
    const availableResults = results.filter(
      (media) => !currentMediaObjects.some((item) => item.id === media.id)
    );
    setSearchResults(availableResults);
  };

  const handleToggleSelection = (media) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((item) => item.id === media.id);
      return isSelected
        ? prev.filter((item) => item.id !== media.id)
        : [...prev, media];
    });
  };

  const handleAddSelected = async () => {
    if (selectedMedia.length === 0) return;
    setIsAdding(true);
    try {
      await Promise.all(selectedMedia.map((media) => onAddItem(media)));
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar itens:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleItemClick = (e, media) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleSelection(media);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Itens Rápido
          </h2>
          <button
            onClick={onClose}
            disabled={isAdding}
            className="text-gray-400 hover:text-white text-2xl disabled:opacity-50 transition-colors"
          >
            ×
          </button>
        </div>

        {/* SearchBar */}
        <div className="p-6 border-b border-gray-700">
          <ListSearchBar onSearchResults={handleSearchResults} modalMode={true} />
        </div>

        {/* Lista de resultados */}
        <div className="overflow-y-auto max-h-96">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p>Busque itens para adicionar à lista...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 p-4">
              {searchResults.map((media) => {
                const isSelected = selectedMedia.some((item) => item.id === media.id);
                return (
                  <div
                    key={media.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-500/20 border border-blue-400/50"
                        : "border border-gray-600 hover:bg-gray-700/50"
                    }`}
                    onClick={(e) => handleItemClick(e, media)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelection(media)}
                      className="mr-3 h-4 w-4 text-blue-400 focus:ring-blue-500 bg-gray-700 border-gray-600 rounded"
                      onClick={(e) => e.stopPropagation()}
                      disabled={isAdding}
                    />
                    <img
                      src={media.poster || media.image}
                      alt={media.title}
                      className="w-12 h-16 object-cover rounded mr-3 border border-gray-600"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{media.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full border border-gray-600/50">
                          {media.type === "movie"
                            ? "Filme"
                            : media.type === "tv"
                            ? "Série"
                            : media.type === "game"
                            ? "Game"
                            : media.type === "music"
                            ? "Música"
                            : media.type}
                        </span>
                        {media.year && <span className="text-xs text-gray-400">{media.year}</span>}
                        {media.rating && (
                          <div className="flex items-center ml-auto">
                            <span className="text-yellow-400 text-xs mr-1">⭐</span>
                            <span className="text-xs text-gray-400">{media.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700 bg-gray-800/80">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {selectedMedia.length} item(s) selecionado(s)
            </span>
            {selectedMedia.length > 0 && (
              <button
                onClick={() => setSelectedMedia([])}
                disabled={isAdding}
                className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
              >
                Limpar seleção
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isAdding}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selectedMedia.length === 0 || isAdding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adicionando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar ({selectedMedia.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}