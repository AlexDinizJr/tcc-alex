import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

export default function AccountSettings({ user }) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleEmailChange = () => {
    setIsChangingEmail(true);
    // Lógica para alterar email seria implementada aqui
    setTimeout(() => {
      setIsChangingEmail(false);
      alert("Email alterado com sucesso!");
    }, 1500);
  };

  const handlePasswordChange = () => {
    setIsChangingPassword(true);
    // Lógica para alterar senha seria implementada aqui
    setTimeout(() => {
      setIsChangingPassword(false);
      alert("Senha alterada com sucesso!");
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações da Conta</h1>
      
      <div className="space-y-6">
        {/* Email */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Email</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">{user.email}</p>
              <p className="text-sm text-gray-500">Email principal da conta</p>
            </div>
            <button
              onClick={handleEmailChange}
              disabled={isChangingEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {isChangingEmail ? "Alterando..." : "Alterar Email"}
            </button>
          </div>
        </div>

        {/* Senha */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Senha</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">••••••••</p>
              <p className="text-sm text-gray-500">Sua senha atual</p>
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {isChangingPassword ? "Alterando..." : "Alterar Senha"}
            </button>
          </div>
        </div>

        {/* Excluir Conta */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-800 mb-3">Zona de Perigo</h3>
          <p className="text-red-600 text-sm mb-4">
            Excluir sua conta é uma ação permanente. Todos os seus dados, listas, 
            avaliações e itens salvos serão removidos e não poderão ser recuperados.
          </p>
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Excluir Minha Conta
          </button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {isDeleteConfirmOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteConfirmOpen(false)} />
      )}
    </div>
  );
}