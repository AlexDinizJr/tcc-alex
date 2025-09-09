import { useState, useEffect } from "react";
import { FaBookmark, FaHeart, FaPlus } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi"; // ⬅️ Ícone de compartilhar
import { useAuth } from "../../hooks/useAuth";
import AddToListModal from "./AddToListModal";
import ShareMediaModal from "../ShareMediaModal"; // ⬅️ Importa o modal

export default function MediaActions({ mediaItem }) {
  const { 
    user, 
    toggleSavedMedia, 
    toggleFavorite, 
    addMediaToList,
    isAuthenticated 
  } = useAuth();
  
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false); // ⬅️ Novo estado

  useEffect(() => {
    if (user) {
      setIsSaved(user.savedMedia?.includes(mediaItem.id) || false);
      setIsFavorited(user.favorites?.includes(mediaItem.id) || false);
    }
  }, [user, mediaItem.id]);

  const handleSave = () => {
    if (!isAuthenticated) return alert("Você precisa estar logado para salvar itens!");
    const result = toggleSavedMedia(mediaItem);
    if (result.success) setIsSaved(result.isSaved);
    else alert(result.error);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) return alert("Você precisa estar logado para favoritar itens!");
    const result = toggleFavorite(mediaItem);
    if (result.success) setIsFavorited(result.isFavorited);
    else alert(result.error);
  };

  const handleAddToList = () => {
    if (!isAuthenticated) return alert("Você precisa estar logado para adicionar itens a listas!");
    setShowAddToListModal(true);
  };

  const handleAddToListConfirm = (listId, listName = null) => {
    if (!isAuthenticated) return alert("Você precisa estar logado para adicionar itens a listas!");
    if (!mediaItem?.id) return alert("Erro: Item de mídia inválido!");

    const result = addMediaToList(mediaItem, listId, listName);
    if (result.success) {
      alert(`"${mediaItem.title}" adicionado à lista ${result.list.name} com sucesso!`);
      setShowAddToListModal(false);
    } else {
      alert(result.error || "Erro ao adicionar à lista");
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

        {/* 🔗 Botão de Compartilhar */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700/80 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-colors cursor-pointer"
        >
          <FiShare2 />
          Compartilhar
        </button>
      </div>

      {/* Modal de Adicionar à Lista */}
      {showAddToListModal && (
        <AddToListModal 
          mediaItem={mediaItem}
          userLists={user?.lists || []}
          onAddToList={handleAddToListConfirm}
          onClose={() => setShowAddToListModal(false)}
        />
      )}

      {/* Modal de Compartilhar */}
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
