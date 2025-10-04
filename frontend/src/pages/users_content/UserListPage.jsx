import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import QuickAddModal from "../../components/lists/QuickAddModal";
import EditListModal from "../../components/lists/EditListModal";
import MediaCardWithActions from "../../components/lists/MediaCardWithActions";
import MediaHeader from "../../components/contents/MediaPageHeader";
import Pagination from "../../components/Pagination";
import { fetchUserByUsername } from "../../services/userService";
import { fetchListById } from "../../services/listsService";

export default function UserList() {
  const { username, id } = useParams();
  const { showToast } = useToast();
  const parsedListId = parseInt(id);
  const navigate = useNavigate();
  const { user: loggedInUser, addMediaToList, removeMediaFromList, updateUser, deleteList, updateList } = useAuth();

  const [user, setUser] = useState(undefined);
  const [localList, setLocalList] = useState(undefined);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const isOwner = loggedInUser?.username === username;

  // Carregar usuário
  useEffect(() => {
    async function loadUser() {
      if (isOwner) {
        setUser(loggedInUser);
      } else {
        try {
          const fetchedUser = await fetchUserByUsername(username);
          setUser(fetchedUser || null);
        } catch {
          setUser(null);
        }
      }
    }
    loadUser();
  }, [username, loggedInUser, isOwner]);

  // Carregar lista
  useEffect(() => {
    async function loadList() {
      if (!user) return;
      try {
        const fetchedList = await fetchListById(parsedListId);
        setLocalList(fetchedList || null);
      } catch {
        setLocalList(null);
      }
    }
    loadList();
  }, [user, parsedListId]);

  // Lista de mídia filtrada e ordenada
  const filteredAndSortedItems = useMemo(() => {
    if (!localList?.items) return [];
    let items = [...localList.items];
    
    return items;
  }, [localList]);

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
      } else throw new Error(result.error);
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
    }
  };

  const handleDeleteList = async () => {
    if (!isOwner) return;
    try {
      const result = deleteList(localList.id, user, updateUser);
      if (result.success) navigate(`/users/${username}/lists`);
      else throw new Error(result.error);
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
    }
  };

  const handleQuickAdd = async (mediaItem) => {
    if (!isOwner) return;
    const result = await addMediaToList(mediaItem, localList.id, null, user, updateUser);
    if (result.success) {
      setLocalList(prev => ({ ...prev, items: [...(prev.items || []), mediaItem] }));
      return showToast(`"${mediaItem.title}" adicionado à lista!`, "success");
    } else {
      return showToast("Erro ao adicionar item à lista.", "error"); 
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!isOwner) return;
    try {
      const result = await removeMediaFromList(itemId, localList.id, user, updateUser);
      if (result.success) {
        setLocalList(prev => ({ ...prev, items: prev.items.filter(item => item.id !== itemId) }));
      } else throw new Error(result.error);
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  // Renderizações de erro
  if (!user) return <div className="flex justify-center items-center min-h-screen"><p className="text-lg text-gray-600">Usuário não encontrado</p></div>;
  if (!localList) return <div className="flex justify-center items-center min-h-screen"><p className="text-lg text-gray-600">Lista não encontrada</p></div>;
  if (!id || isNaN(parsedListId)) return <div className="flex justify-center items-center min-h-screen"><p className="text-lg text-gray-600">ID da lista inválido</p></div>;

  return (
    <div className="container w-full max-w-6xl mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">

        <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-8 mb-8 relative">

          {/* Linha 1: Título e botão de edição */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
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

          {/* Linha 2: Autor + Visibilidade */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Autor:</span>
              <span
                className="text-blue-400 text-sm font-medium cursor-pointer hover:underline"
                onClick={() => navigate(`/users/${user.username}/lists`)}
              >
                {user.name || user.username}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm inline-block ${
                localList.isPublic ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {localList.isPublic ? "Pública" : "Privada"}
            </span>
          </div>

          {/* Linha 3: Contagem de itens + descrição */}
          <div className="text-gray-400 text-sm">
            <p>{localList.items?.length || 0} itens</p>
            {localList.description && <p className="mt-1">{localList.description}</p>}
          </div>

          {/* Botão de adicionar itens (somente para o dono) */}
            {isOwner && (
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-4 text-sm shadow-md cursor-pointer z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Itens
            </button>
          )}
        </div>

        {mediaItemsToShow.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {mediaItemsToShow.map(item => (
                <MediaCardWithActions key={item.id} media={item} onDelete={handleDeleteItem} showDelete={isOwner} />
              ))}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📋</div>
            <p className="text-gray-500">"Esta lista está vazia."</p>
            <p className="text-gray-400 text-sm mt-2">
              {isOwner ? "Use o botão 'Adicionar Itens' para começar!" : "Esta lista ainda não possui itens."}
            </p>
          </div>
        )}

        {isOwner && showQuickAddModal && <QuickAddModal onClose={() => setShowQuickAddModal(false)} onAddItem={handleQuickAdd} currentListItems={localList.items || []} />}
        {isOwner && showEditModal && <EditListModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSaveList} onDelete={handleDeleteList} list={localList} />}
      </div>
    </div>
  );
}