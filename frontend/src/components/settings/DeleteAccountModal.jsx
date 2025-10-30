import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";

export default function DeleteAccountModal({ onClose }) {
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password) {
      showToast("Por favor, digite sua senha para confirmar.", "warning");
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount(password); // envia a senha
      navigate("/");
      showToast("Sua conta foi excluída com sucesso.", "success");
    } catch (error) {
      showToast(error.message || "Erro ao excluir conta. Tente novamente.", "error");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-gray-700/50 rounded-2xl p-6 w-full max-w-md shadow-md animate-modalPop">
        <h2 className="text-xl font-bold text-red-400 mb-4">Excluir Conta</h2>
        
        <div className="space-y-4">
          <p className="text-gray-300">
            Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
          </p>

          <div className="bg-red-800/30 p-4 rounded-lg border border-red-700/50">
            <p className="text-sm text-red-300 font-medium mb-2">
              Para confirmar, digite sua senha:
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-3 py-2 border border-red-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting || !password}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Excluindo..." : "Excluir Conta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}