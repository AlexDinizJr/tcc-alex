import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900/90 border border-gray-700/50 rounded-2xl p-6 w-full max-w-md shadow-md relative">
        <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function AccountSettings({ user }) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "", currentPassword: "" });

  const handleEmailChange = async () => {
    if (!emailForm.newEmail || !emailForm.currentPassword) {
      alert("Preencha o novo email e a senha atual");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      alert("Email alterado com sucesso!");
      setEmailForm({ newEmail: "", currentPassword: "" });
      setIsEmailModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Falha ao alterar email");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    const { newPassword, confirmPassword, currentPassword } = passwordForm;
    if (!newPassword || !confirmPassword || !currentPassword) {
      alert("Preencha todos os campos");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      alert("Senha alterada com sucesso!");
      setPasswordForm({ newPassword: "", confirmPassword: "", currentPassword: "" });
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Falha ao alterar senha");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Configurações da Conta</h1>

      <div className="space-y-6">
        {/* Email */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-6 flex justify-between items-center shadow-md">
          <div>
            <h3 className="font-semibold text-white mb-1">Email</h3>
            <p className="text-gray-300 text-sm">{user.email}</p>
          </div>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm"
          >
            Alterar Email
          </button>
        </div>

        {/* Senha */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-6 flex justify-between items-center shadow-md">
          <div>
            <h3 className="font-semibold text-white mb-1">Senha</h3>
            <p className="text-gray-300 text-sm">••••••••</p>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm"
          >
            Alterar Senha
          </button>
        </div>

        {/* Excluir Conta */}
        <div className="bg-red-800/70 border border-red-700/50 rounded-2xl p-6 shadow-md">
          <h3 className="font-semibold text-red-400 mb-3">Zona de Perigo</h3>
          <p className="text-red-300 text-sm mb-4">
            Excluir sua conta é uma ação permanente. Todos os seus dados serão removidos.
          </p>
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors text-sm"
          >
            Excluir Minha Conta
          </button>
        </div>
      </div>

      {/* Modal Email */}
      {isEmailModalOpen && (
        <Modal title="Alterar Email" onClose={() => setIsEmailModalOpen(false)}>
          <input
            type="email"
            placeholder="Novo email"
            value={emailForm.newEmail}
            onChange={e => setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg mb-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Senha atual"
            value={emailForm.currentPassword}
            onChange={e => setEmailForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleEmailChange}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors w-full"
          >
            {isSubmitting ? "Alterando..." : "Confirmar Alteração"}
          </button>
        </Modal>
      )}

      {/* Modal Senha */}
      {isPasswordModalOpen && (
        <Modal title="Alterar Senha" onClose={() => setIsPasswordModalOpen(false)}>
          <input
            type="password"
            placeholder="Nova senha"
            value={passwordForm.newPassword}
            onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg mb-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={passwordForm.confirmPassword}
            onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg mb-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Senha atual"
            value={passwordForm.currentPassword}
            onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handlePasswordChange}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors w-full"
          >
            {isSubmitting ? "Alterando..." : "Confirmar Alteração"}
          </button>
        </Modal>
      )}

      {/* Modal Delete */}
      {isDeleteConfirmOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteConfirmOpen(false)} />
      )}
    </div>
  );
}
