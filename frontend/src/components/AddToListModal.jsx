import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

export default function AddToListModal({ mediaItem, userLists, onAddToList, onClose }) {
  const [selectedList, setSelectedList] = useState("");
  const [createNewList, setCreateNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListIsPublic, setNewListIsPublic] = useState(false);
  const [lists, setLists] = useState(userLists || []);
  useLockBodyScroll(true);

  useEffect(() => {
    setLists(userLists || []);
  }, [userLists]);

  const handleAddToList = () => {
    if (createNewList && newListName.trim()) {
      onAddToList(null, newListName.trim(), newListIsPublic);
      setNewListName("");
      setNewListIsPublic(false);
      setCreateNewList(false);
    } else if (selectedList) {
      onAddToList(parseInt(selectedList));
      setSelectedList("");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-modalPop">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <FaPlus className="text-blue-400 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white">Adicionar à lista</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Preview da mídia */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <img
            src={mediaItem.image}
            alt={mediaItem.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold truncate">{mediaItem.title}</h3>
            <p className="text-gray-400 text-sm">{mediaItem.type}</p>
          </div>
        </div>

        {/* Seletor de listas */}
        <div className="space-y-4 text-gray-100">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="existing-list"
              checked={!createNewList}
              onChange={() => setCreateNewList(false)}
              className="mr-2"
            />
            <label htmlFor="existing-list" className="text-sm">Lista existente</label>
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

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="new-list"
              checked={createNewList}
              onChange={() => setCreateNewList(true)}
              className="mr-2"
            />
            <label htmlFor="new-list" className="text-sm">Nova lista</label>
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

        {/* Botões */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 border border-gray-700 rounded  text-white text-sm hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddToList}
            disabled={(createNewList && !newListName.trim()) || (!createNewList && !selectedList)}
            className="flex-1 py-2 px-3 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}