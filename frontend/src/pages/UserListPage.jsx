import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { MOCK_LISTS } from "../mockdata/mockLists";
import QuickAddModal from "../components/lists/QuickAddModal";
import EditListModal from "../components/lists/EditListModal";
import MediaCardWithActions from "../components/MediaCardWithActions";
import MediaHeader from "../components/MediaPageHeader";
import Pagination from "../components/Pagination";
import { convertMediaIdsToObjects } from "../utils/MediaHelpers";
import { BackToProfile } from "../components/BackToProfile";

export default function UserList() {
  const params = useParams();
  const username = params.username;
  const listId = params.id || params.listId;
  const parsedListId = parseInt(listId);

  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { user, addMediaToList, removeMediaFromList, updateUser, updateList, deleteList } = useAuth();

  // Garantir que lists seja sempre um array
  const userLists = Array.isArray(user?.lists) ? user.lists : [];

  // Buscar lista do usuário logado ou dos mocks
  let userList = userLists.find((list) => list.id === parsedListId);
  if (!userList) {
    userList = MOCK_LISTS.find((list) => list.id === parsedListId);
  }

  // 🔑 Verifica se o usuário logado é dono da lista
  const isOwner = user && userList && user.username === username;

  // Converter IDs para objetos completos
  const allMediaItems = useMemo(() => {
    if (!userList || !Array.isArray(userList.items)) return [];
    return convertMediaIdsToObjects(userList.items);
  }, [userList]);

  // Filtrar e ordenar
  const filteredAndSortedItems = useMemo(() => {
    let items = allMediaItems;
    if (searchQuery.trim() !== "") {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "title") {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "rating") {
      items = [...items].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "year") {
      items = [...items].sort((a, b) => b.year - a.year);
    }
    return items;
  }, [allMediaItems, searchQuery, sortBy]);

  // Paginação
  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const mediaItemsToShow = filteredAndSortedItems.slice(startIdx, endIdx);

  // Handlers
  const handleSaveList = async (updatedData) => {
    if (!isOwner) return;
    try {
      const result = updateList(userList.id, updatedData);
      if (result.success) {
        alert("Lista atualizada com sucesso!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
      alert(error.message || "Erro ao atualizar lista");
    }
  };

  const handleDeleteList = async () => {
    if (!isOwner) return;
    try {
      const result = deleteList(userList.id);
      if (result.success) {
        alert("Lista excluída com sucesso!");
        window.location.href = "/lists";
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
      alert(error.message || "Erro ao excluir lista");
    }
  };

  const handleQuickAdd = async (mediaItem) => {
    if (!isOwner) return;
    const result = addMediaToList(mediaItem, parsedListId, null, user, updateUser);
    if (result.success) {
      console.log(`"${mediaItem.title}" adicionado à lista com sucesso!`);
      return Promise.resolve();
    } else {
      alert(result.error || "Erro ao adicionar à lista");
      return Promise.reject(result.error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!isOwner) return;
    try {
      const result = await removeMediaFromList(itemId, parsedListId, user, updateUser);
      if (result.success) {
        console.log(`Item ${itemId} removido com sucesso!`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao remover item:", error);
      alert(error.message || "Erro ao remover item");
    }
  };

  // Casos de erro
  if (!listId || isNaN(parsedListId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">ID da lista inválido</p>
      </div>
    );
  }
  if (!userList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Lista não encontrada</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Botão de voltar para o perfil */}
          <div className="mb-4">
            <BackToProfile username={username} />
          </div>
        {/* Header da lista */}
        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8 relative pb-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{userList.name}</h1>
              {isOwner && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
                  title="Editar lista"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                userList.isPublic ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {userList.isPublic ? "Pública" : "Privada"}
            </span>
          </div>

          {/* Descrição */}
          <div className="mt-3 pr-28">
            <p className="text-gray-400">{allMediaItems.length} itens</p>
            {userList.description && (
              <p className="text-gray-400 mt-1">{userList.description}</p>
            )}
          </div>

          {/* 🔒 Botão de adicionar só aparece pro dono */}
          {isOwner && (
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="absolute bottom-8 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Itens
            </button>
          )}
        </div>

        {/* Media Header */}
        <MediaHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          itemsCount={filteredAndSortedItems.length}
        />

        {/* Grid */}
        {mediaItemsToShow.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {mediaItemsToShow.map((item) => (
                <MediaCardWithActions
                  key={item.id}
                  media={item}
                  onDelete={handleDeleteItem}
                  showDelete={isOwner}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📋</div>
            <p className="text-gray-500">
              {searchQuery ? "Nenhum item encontrado para sua busca." : "Esta lista está vazia."}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery 
                ? "Tente alterar os termos da busca." 
                : isOwner 
                  ? "Use o botão 'Adicionar Itens' para começar!" 
                  : "Esta lista ainda não possui itens."
              }
            </p>
          </div>
        )}

        {/* Modais - só abre se for o dono */}
        {isOwner && showQuickAddModal && (
          <QuickAddModal
            onClose={() => setShowQuickAddModal(false)}
            onAddItem={handleQuickAdd}
            currentListItems={userList.items || []}
          />
        )}
        {isOwner && showEditModal && (
          <EditListModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveList}
            onDelete={handleDeleteList}
            list={userList}
          />
        )}
      </div>
    </div>
  );
}
