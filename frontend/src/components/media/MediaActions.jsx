import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import AddToListModal from "./AddToListModal";

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

  useEffect(() => {
    if (user) {
      setIsSaved(user.savedMedia?.includes(mediaItem.id) || false);
      setIsFavorited(user.favorites?.includes(mediaItem.id) || false);
    }
  }, [user, mediaItem.id]);

  const handleSave = () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para salvar itens!");
      return;
    }

    const result = toggleSavedMedia(mediaItem);
    if (result.success) {
      setIsSaved(result.isSaved);
    } else {
      alert(result.error);
    }
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para favoritar itens!");
      return;
    }

    const result = toggleFavorite(mediaItem);
    if (result.success) {
      setIsFavorited(result.isFavorited);
    } else {
      alert(result.error);
    }
  };

  const handleAddToList = () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para adicionar itens a listas!");
      return;
    }
    setShowAddToListModal(true);
  };

const handleAddToListConfirm = (listId, listName = null) => {
  if (!isAuthenticated) {
    alert("Você precisa estar logado para adicionar itens a listas!");
    return;
  }

  console.log('📌 Tentando adicionar à lista:', { listId, listName });
  console.log('📌 Mídia:', mediaItem);

  // Verifique se mediaItem existe e tem ID
  if (!mediaItem || !mediaItem.id) {
    alert("Erro: Item de mídia inválido!");
    return;
  }

  const result = addMediaToList(mediaItem, listId, listName);
  
  console.log('📌 Resultado:', result);
  
  if (result.success) {
    alert(`"${mediaItem.title}" adicionado à lista ${result.list.name} com sucesso!`);
    setShowAddToListModal(false);
  } else {
    // Mostra mensagem de erro específica
    alert(result.error || "Erro ao adicionar à lista");
    if (result.error?.includes('já está')) {
      // Fecha o modal se for duplicata
      setShowAddToListModal(false);
    }
  }
};

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
            isSaved
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {isSaved ? 'Salvo' : 'Salvar'}
        </button>

        <button
          onClick={handleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
            isFavorited
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isFavorited ? 'Favoritado' : 'Favoritar'}
        </button>

        <button
          onClick={handleAddToList}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adicionar à Lista
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
    </>
  );
}