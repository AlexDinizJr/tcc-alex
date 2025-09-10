import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { deleteList, updateList } from "../../contexts/AuthListFunctions";
import { MOCK_LISTS } from "../../mockdata/mockLists";
import QuickAddModal from "../../components/lists/QuickAddModal";
import EditListModal from "../../components/lists/EditListModal";
import MediaCardWithActions from "../../components/lists/MediaCardWithActions";
import MediaHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { convertMediaIdsToObjects } from "../../utils/MediaHelpers";
import { BackToProfile } from "../../components/profile/BackToProfile";

export default function UserList() {
  const params = useParams();
  const navigate = useNavigate();
  const username = params.username;
  const listId = params.id || params.listId;
  const parsedListId = parseInt(listId);

  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { user, addMediaToList, removeMediaFromList, updateUser } = useAuth();

  // Estado local da lista para atualização em tempo real
  const [localList, setLocalList] = useState(() => {
    const lists = Array.isArray(user?.lists) ? user.lists : [];
    return lists.find(l => l.id === parsedListId) || MOCK_LISTS.find(l => l.id === parsedListId);
  });

  // Sincronizar localList quando user mudar
  useEffect(() => {
    const lists = Array.isArray(user?.lists) ? user.lists : [];
    const updatedList = lists.find(l => l.id === parsedListId) || MOCK_LISTS.find(l => l.id === parsedListId);
    setLocalList(updatedList);
  }, [user, parsedListId]);

  const isOwner = user && localList && user.username === username;

  const allMediaItems = useMemo(() => {
    if (!localList || !Array.isArray(localList.items)) return [];
    return convertMediaIdsToObjects(localList.items);
  }, [localList]);

  const filteredAndSortedItems = useMemo(() => {
    let items = allMediaItems;
    if (searchQuery.trim() !== "") {
      items = items.filter(item =>
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

  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const mediaItemsToShow = filteredAndSortedItems.slice(startIdx, endIdx);

  // Handlers
    const handleSaveList = async (updatedData) => {
    if (!isOwner) return;
    try {
      const result = updateList(localList.id, updatedData, user, updateUser);
      if (result.success) {
        setLocalList(prev => ({ ...prev, ...updatedData, updatedAt: new Date().toISOString() }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
    }
  };

  const handleDeleteList = async () => {
    if (!isOwner) return;
    try {
      const result = deleteList(localList.id, user, updateUser);
      if (result.success) {
        navigate(`/users/${username}/lists`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
    }
  };

  const handleQuickAdd = async (mediaItem) => {
    if (!isOwner) return;
    const result = addMediaToList(mediaItem, localList.id, null, user, updateUser);
    if (result.success) {
      setLocalList(prev => ({
        ...prev,
        items: [...(prev.items || []), mediaItem.id]
      }));
      return Promise.resolve();
    } else {
      return Promise.reject(result.error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!isOwner) return;
    try {
      const result = await removeMediaFromList(itemId, localList.id, user, updateUser);
      if (result.success) {
        setLocalList(prev => ({
          ...prev,
          items: prev.items.filter(id => id !== itemId)
        }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  if (!listId || isNaN(parsedListId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">ID da lista inválido</p>
      </div>
    );
  }

  if (!localList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Lista não encontrada</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <BackToProfile username={username} />
        </div>

        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-6 mb-8 relative pb-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{localList.name}</h1>
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
                localList.isPublic ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {localList.isPublic ? "Pública" : "Privada"}
            </span>
          </div>

          <div className="mt-3 pr-28">
            <p className="text-gray-400">{allMediaItems.length} itens</p>
            {localList.description && (
              <p className="text-gray-400 mt-1">{localList.description}</p>
            )}
          </div>

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

        <MediaHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          itemsCount={filteredAndSortedItems.length}
        />

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

        {isOwner && showQuickAddModal && (
          <QuickAddModal
            onClose={() => setShowQuickAddModal(false)}
            onAddItem={handleQuickAdd}
            currentListItems={localList.items || []}
          />
        )}
        {isOwner && showEditModal && (
          <EditListModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveList}
            onDelete={handleDeleteList}
            list={localList}
          />
        )}
      </div>
    </div>
  );
}
