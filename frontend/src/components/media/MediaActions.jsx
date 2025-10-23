import { useState, useEffect } from "react";
import { FaBookmark, FaHeart, FaPlus } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import AddToListModal from "../AddToListModal";
import ShareMediaModal from "../ShareMediaModal";

export default function MediaActions({ mediaItem }) {
  const { 
    user, 
    toggleSavedMedia, 
    toggleFavorite, 
    addMediaToList,
    updateUser,
    isAuthenticated 
  } = useAuth();

  const { showToast } = useToast();

  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (user) {
      setIsSaved(user.savedMedia?.some(m => m.id === mediaItem.id) || false);
      setIsFavorited(user.favorites?.some(m => m.id === mediaItem.id) || false);
    }
  }, [user, mediaItem.id]);

  const handleSave = async () => {
    if (!isAuthenticated) return showToast("Você precisa estar logado para salvar itens!", "warning");

    try {
      const result = await toggleSavedMedia(mediaItem);
      if (result.success) setIsSaved(result.isSaved);
      else showToast(result.error || "Erro ao salvar item", "error");
    } catch (err) {
      console.error(err);
      showToast("Erro ao salvar item", "error");
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) return showToast("Você precisa estar logado para favoritar itens!", "warning");

    try {
      const result = await toggleFavorite(mediaItem);
      if (result.success) setIsFavorited(result.isFavorited);
      else showToast(result.error || "Erro ao favoritar item", "error");
    } catch (err) {
      console.error(err);
      showToast("Erro ao favoritar item", "error");
    }
  };

  const handleAddToList = () => {
    if (!isAuthenticated) return showToast("Você precisa estar logado para adicionar itens a listas!", "warning");
    setShowAddToListModal(true);
  };

  const handleAddToListConfirm = async (listId, listName = null, isPublic = false) => {
    if (!isAuthenticated)
      return showToast("Você precisa estar logado para adicionar itens a listas!", "warning");
    if (!mediaItem?.id)
      return showToast("Erro: Item de mídia inválido!", "error");

    try {
      const result = await addMediaToList(mediaItem, listId, listName, isPublic);

      if (result.success) {
        // 🔥 Atualiza as listas do usuário no frontend caso seja nova lista
        if (listName && result.list) {
          updateUser(prev => ({
            ...prev,
            lists: [...(prev.lists || []), result.list]
          }));
        }

        showToast(
          listName 
            ? `Lista "${listName}" criada com "${mediaItem.title}" adicionada!` 
            : `"${mediaItem.title}" adicionado à lista!`,
          "success"
        );
        setShowAddToListModal(false);

      } else if (result.isDuplicate) {
        showToast(`"${mediaItem.title}" já está nesta lista!`, "warning");
        setShowAddToListModal(false);

      } else {
        showToast(result.error || "Erro ao adicionar à lista", "error");
      }

    } catch (error) {
      console.error("Erro inesperado ao adicionar à lista:", error);
      showToast("Erro inesperado ao adicionar à lista", "error");
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-4 mb-4">
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