import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

export default function DeleteItemModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName,
  isDeleting = false
}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      showToast(`"${itemName}" foi removido com sucesso!`, "success");
      onClose();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      showToast("Erro ao remover item. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const isBusy = isDeleting || loading;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700">
        {/* Ícone de alerta */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-4 text-center">Confirmar exclusão</h3>
        <p className="text-gray-300 mb-6 text-center">
          Tem certeza que deseja remover <span className="font-semibold text-white">"{itemName}"</span> da lista?
          <br />
          <span className="text-red-400 text-sm">Esta ação não pode ser desfeita.</span>
        </p>
        
        {/* Botões */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            disabled={isBusy}
            className="px-4 py-2 flex items-center justify-center h-10 text-gray-300 hover:text-white font-medium rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isBusy}
            className="px-4 py-2 flex items-center justify-center h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed gap-2 transition-colors"
          >
            {isBusy ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Removendo...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Sim, remover
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
