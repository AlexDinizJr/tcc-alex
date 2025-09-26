import { useState, useEffect } from "react";

export default function AddToListModal({ mediaItem, userLists, onAddToList, onClose }) {
  const [selectedList, setSelectedList] = useState("");
  const [createNewList, setCreateNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListIsPublic, setNewListIsPublic] = useState(false);
  const [lists, setLists] = useState(userLists || []);

  // 🔹 Atualiza as listas quando userLists mudar
  useEffect(() => {
    setLists(userLists || []);
  }, [userLists]);

  const handleAddToList = () => {
    if (createNewList && newListName.trim()) {
      onAddToList(null, newListName.trim(), newListIsPublic);
      // limpa input após adicionar
      setNewListName("");
      setNewListIsPublic(false);
      setCreateNewList(false);
    } else if (selectedList) {
      onAddToList(parseInt(selectedList));
      setSelectedList(""); // limpa seleção após adicionar
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Adicionar à lista</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 text-gray-100">
            <div className="text-sm">
              Adicionando: <span className="font-medium">{mediaItem.title}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="existing-list"
                  checked={!createNewList}
                  onChange={() => setCreateNewList(false)}
                  className="mr-2"
                />
                <label htmlFor="existing-list">Lista existente</label>
              </div>
              
              {!createNewList && (
                <select
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700 rounded text-sm"
                >
                  <option value="">Selecione uma lista</option>
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="new-list"
                  checked={createNewList}
                  onChange={() => setCreateNewList(true)}
                  className="mr-2"
                />
                <label htmlFor="new-list">Nova lista</label>
              </div>
              
              {createNewList && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome da lista"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-700 rounded text-sm"
                  />
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={newListIsPublic}
                      onChange={(e) => setNewListIsPublic(e.target.checked)}
                      className="mr-2"
                    />
                    Lista pública
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 border border-gray-700 rounded text-sm hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddToList}
              disabled={(createNewList && !newListName.trim()) || (!createNewList && !selectedList)}
              className="flex-1 py-2 px-3 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}