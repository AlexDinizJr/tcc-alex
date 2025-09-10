import { useState } from "react";
import { useToast } from "../../hooks/useToast";

export default function EditListModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  list 
}) {
  const { showToast } = useToast();

  const [name, setName] = useState(list?.name || "");
  const [description, setDescription] = useState(list?.description || "");
  const [isPublic, setIsPublic] = useState(list?.isPublic || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("O nome da lista é obrigatório!", "warning");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        isPublic
      });
      showToast("Lista salva com sucesso!", "success");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar lista:", error);
      showToast("Erro ao salvar alterações.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      showToast(`"${list.name}" foi excluída com sucesso!`, "success");
      onClose();
    } catch (error) {
      console.error("Erro ao excluir lista:", error);
      showToast("Erro ao excluir lista.", "error");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const isBusy = isSaving || isDeleting;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar Lista
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da Lista */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome da lista *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              placeholder="Digite o nome da lista"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
              placeholder="Digite uma descrição para a lista"
            />
          </div>

          {/* Visibilidade */}
          <div className="flex items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-blue-400 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">
              Lista pública
            </label>
            <span className="ml-auto text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              {isPublic ? 'Visível para todos' : 'Apenas você'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-center items-center pt-4 border-t border-gray-700 gap-3">
            {confirmDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isBusy}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Confirmar"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={isBusy}
                className="px-4 py-2 text-red-400 hover:text-red-300 font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir Lista
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-colors text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isBusy}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors text-sm"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
