import { useState } from "react";
import ListSearchBar from "./ListSearchBar";
import { convertMediaIdsToObjects } from "../../utils/MediaHelpers"; // Importe o helper

export default function QuickAddModal({ onClose, onAddItem, currentListItems }) {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  // Converter IDs para objetos para a verificação de duplicatas
  const currentMediaObjects = convertMediaIdsToObjects(currentListItems);

  const handleSearchResults = (results) => {
    // Filtrar resultados para excluir itens já na lista (usando objetos convertidos)
    const availableResults = results.filter(media => 
      !currentMediaObjects.some(item => item.id === media.id)
    );
    setSearchResults(availableResults);
  };

  const handleToggleSelection = (media) => {
    setSelectedMedia(prev => {
      const isSelected = prev.some(item => item.id === media.id);
      if (isSelected) {
        return prev.filter(item => item.id !== media.id);
      } else {
        return [...prev, media];
      }
    });
  };

  const handleAddSelected = async () => {
    if (selectedMedia.length === 0) {
      alert("Selecione pelo menos um item para adicionar!");
      return;
    }

    setIsAdding(true);
    try {
      // Adicionar cada item individualmente
      for (const media of selectedMedia) {
        await onAddItem(media); // Agora passa item por item
      }
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar itens:", error);
      alert("Erro ao adicionar itens. Tente novamente.");
    } finally {
      setIsAdding(false);
    }
  };

  // Prevenir navegação quando clicar em um item no modal
  const handleItemClick = (e, media) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggleSelection(media);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Adicionar Itens Rápido</h2>
          <button
            onClick={onClose}
            disabled={isAdding}
            className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* SearchBar em modo modal */}
        <div className="p-6 border-b">
          <ListSearchBar
            onSearchResults={handleSearchResults}
            modalMode={true}
          />
        </div>

        {/* Lista de resultados */}
        <div className="overflow-y-auto max-h-96">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Busque itens para adicionar à lista...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 p-4">
              {searchResults.map((media) => (
                <div
                  key={media.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedMedia.some(item => item.id === media.id) 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'border border-gray-100'
                  }`}
                  onClick={(e) => handleItemClick(e, media)}
                >
                  <input
                    type="checkbox"
                    checked={selectedMedia.some(item => item.id === media.id)}
                    onChange={() => handleToggleSelection(media)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()} // Prevenir toggle duplo
                    disabled={isAdding}
                  />
                  <img
                    src={media.poster || media.image}
                    alt={media.title}
                    className="w-12 h-16 object-cover rounded mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{media.title}</h3>
                    <p className="text-sm text-gray-500">
                      {media.type === 'movie' ? 'Filme' : 
                       media.type === 'tv' ? 'Série' : 
                       media.type === 'game' ? 'Game' : 
                       media.type === 'music' ? 'Música' : media.type} • {media.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedMedia.length} item(s) selecionado(s)
            </span>
            {selectedMedia.length > 0 && (
              <button
                onClick={() => setSelectedMedia([])}
                disabled={isAdding}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Limpar seleção
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isAdding}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selectedMedia.length === 0 || isAdding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adicionando...
                </>
              ) : (
                `Adicionar (${selectedMedia.length})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}