import { useState, useEffect } from "react";
import { FaBookmark, FaHeart, FaPlus } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import AddToListModal from "./AddToListModal";
import ShareMediaModal from "../ShareMediaModal";

export default function MediaActions({ mediaItem }) {
  const { 
    user, 
    toggleSavedMedia, 
    toggleFavorite, 
    addMediaToList,
    isAuthenticated 
  } = useAuth();
  
  const { showToast } = useToast();

  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (user) {
      setIsSaved(user.savedMedia?.includes(mediaItem.id) || false);
      setIsFavorited(user.favorites?.includes(mediaItem.id) || false);
    }
  }, [user, mediaItem.id]);

  const handleSave = () => {
    if (!isAuthenticated) return showToast("Você precisa estar logado para salvar itens!", "warning");
    
    const result = toggleSavedMedia(mediaItem);
    if (result.success) setIsSaved(result.isSaved);
    else showToast(result.error || "Erro ao salvar item", "error");
  };

  const handleFavorite = () => {
    if (!isAuthenticated) return showToast("Você precisa estar logado para favoritar itens!", "warning");
    
    const result = toggleFavorite(mediaItem);
    if (result.success) setIsFavorited(result.isFavorited);
    else showToast(result.error || "Erro ao favoritar item", "error");
  };

  const handleAddToList = () => {
    if (!isAuthenticated) return showToast("Você precisa estar logado para adicionar itens a listas!", "warning");
    setShowAddToListModal(true);
  };

  const handleAddToListConfirm = (listId, listName = null) => {
    if (!isAuthenticated) return showToast("Você precisa estar logado para adicionar itens a listas!", "warning");
    if (!mediaItem?.id) return showToast("Erro: Item de mídia inválido!", "error");

    const result = addMediaToList(mediaItem, listId, listName);
    if (result.success) {
      showToast(`"${mediaItem.title}" adicionado à lista ${result.list.name} com sucesso!`, "success");
      setShowAddToListModal(false);
    } else {
      showToast(result.error || "Erro ao adicionar à lista", "error");
      if (result.error?.includes('já está')) setShowAddToListModal(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-6 mb-6">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
            isSaved
              ? 'bg-green-600 text-gray-100 hover:bg-green-500'
              : 'bg-gray-700/80 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <FaBookmark />
          {isSaved ? 'Salvo' : 'Salvar'}
        </button>

        <button
          onClick={handleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
            isFavorited
              ? 'bg-red-600 text-gray-100 hover:bg-red-500'
              : 'bg-gray-700/80 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <FaHeart />
          {isFavorited ? 'Favoritado' : 'Favoritar'}
        </button>

        <button
          onClick={handleAddToList}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-gray-100 rounded-lg font-semibold hover:bg-blue-500 transition-colors cursor-pointer"
        >
          <FaPlus />
          Adicionar à Lista
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700/80 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-colors cursor-pointer"
        >
          <FiShare2 />
          Compartilhar
        </button>
      </div>

      {showAddToListModal && (
        <AddToListModal 
          mediaItem={mediaItem}
          userLists={user?.lists || []}
          onAddToList={handleAddToListConfirm}
          onClose={() => setShowAddToListModal(false)}
        />
      )}

      {showShareModal && (
        <ShareMediaModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          media={mediaItem}
        />
      )}
    </>
  );
}
