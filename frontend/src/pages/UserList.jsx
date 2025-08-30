import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { MOCK_LISTS } from "../mockdata/mockLists";
import QuickAddModal from "../components/lists/QuickAddModal";
import EditListModal from "../components/lists/EditListModal";
import MediaCardWithActions from "../components/MediaCardWithActions";
import { convertMediaIdsToObjects } from "../utils/MediaHelpers";

export default function UserList() {
  const params = useParams();
  const listId = params.id || params.listId;
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { user, addMediaToList, removeMediaFromList, updateUser, updateList, deleteList } = useAuth();
  
  console.log('🔍 user.lists:', user?.lists);

  // Garantir que lists seja sempre um array
  const userLists = Array.isArray(user?.lists) ? user.lists : [];
  const parsedListId = parseInt(listId);
  
  // Buscar lista PRIMEIRO no usuário, DEPOIS nos mocks
  let userList = userLists.find(list => list.id === parsedListId);
  
  if (!userList) {
    userList = MOCK_LISTS.find(list => list.id === parsedListId);
  }

  console.log('🔍 Lista encontrada:', userList);

  // Converter IDs para objetos completos - AGORA DEPOIS de encontrar a userList
  const mediaItems = userList && Array.isArray(userList.items) 
    ? convertMediaIdsToObjects(userList.items) 
    : [];

  const handleSaveList = async (updatedData) => {
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
      throw error;
    }
  };

  const handleDeleteList = async () => {
    try {
      const result = deleteList(userList.id);
      
      if (result.success) {
        alert("Lista excluída com sucesso!");
        // Redirecionar para a página de listas
        window.location.href = "/lists";
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
      alert(error.message || "Erro ao excluir lista");
    }
  };

  const handleQuickAdd = async (mediaItem) => {  // Agora recebe um item, não um array
    if (!user) {
      alert("Você precisa estar logado para adicionar itens!");
      return;
    }

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
    if (!user) {
      alert("Você precisa estar logado para remover itens!");
      return;
    }

    try {
      const result = await removeMediaFromList(itemId, parsedListId, user, updateUser);
      if (result.success) {
        console.log(`Item ${itemId} removido com sucesso!`);
        // Não precisa mostrar alerta aqui, o modal já mostra confirmação
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao remover item:", error);
      alert(error.message || "Erro ao remover item");
      throw error; // Propaga o erro para o MediaCardWithActions
    }
  };

  if (!listId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">ID da lista não especificado</p>
          <p className="text-gray-500 text-sm">
            Parâmetros recebidos: {JSON.stringify(params)}
          </p>
        </div>
      </div>
    );
  }

  if (isNaN(parsedListId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">ID da lista inválido</p>
          <p className="text-gray-500 text-sm">
            O ID "{listId}" não é um número válido.
          </p>
        </div>
      </div>
    );
  }

  if (!userList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Lista não encontrada</p>
          <p className="text-gray-500 text-sm">
            Lista com ID {parsedListId} não existe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header da lista */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 relative pb-12">
          {/* Linha superior: título + lápis + badge */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-800">{userList.name}</h1>
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
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                userList.isPublic
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {userList.isPublic ? "Pública" : "Privada"}
            </span>
          </div>

          {/* Descrição e contagem */}
          <div className="mt-3 pr-28">
            <p className="text-gray-600">{mediaItems.length} itens</p>
            {userList.description && (
              <p className="text-gray-500 mt-1">{userList.description}</p>
            )}
          </div>

          {/* Botão fixado no canto inferior direito */}
          <button
            onClick={() => setShowQuickAddModal(true)}
            className="absolute bottom-8 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm shadow-md cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Adicionar Itens
          </button>
        </div>

        {/* Grid de mídias com ações */}
        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaItems.map((item) => (
              <MediaCardWithActions 
                key={item.id}
                media={item}
                onDelete={handleDeleteItem}
                showDelete={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📋</div>
            <p className="text-gray-500">Esta lista está vazia.</p>
            <p className="text-gray-400 text-sm mt-2">
              Use o botão "Adicionar Itens" para começar!
            </p>
          </div>
        )}

        {/* Modais */}
        {showQuickAddModal && (
          <QuickAddModal
            onClose={() => setShowQuickAddModal(false)}
            onAddItem={handleQuickAdd}
            currentListItems={userList.items || []} // Passar os IDs, não os objetos
          />
        )}
        {showEditModal && (
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