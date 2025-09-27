import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";

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

export default function AccountSettings() {
  const { user, updateEmail, updatePassword, updateUsername } = useAuth();
  const { showToast } = useToast();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "", currentPassword: "" });
  const [usernameForm, setUsernameForm] = useState({ newUsername: "", currentPassword: "" });

  // --- Handlers ---
  const handleEmailChange = async () => {
    if (!emailForm.newEmail || !emailForm.currentPassword) {
      return showToast("Preencha o novo email e a senha atual", "warning");
    }

    console.log("Enviando para updateEmail:", {
      newEmail: emailForm.newEmail,
      currentPassword: emailForm.currentPassword
    });

    setIsSubmitting(true);
    try {
      const res = await updateEmail(emailForm.currentPassword, emailForm.newEmail);
      if (res.success) {
        showToast("Email alterado com sucesso!", "success");
        setEmailForm({ newEmail: "", currentPassword: "" });
        setIsEmailModalOpen(false);
      } else {
        showToast(res.error || "Falha ao alterar email", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Falha ao alterar email", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    const { newPassword, confirmPassword, currentPassword } = passwordForm;
    if (!newPassword || !confirmPassword || !currentPassword) {
      return showToast("Preencha todos os campos", "warning");
    }
    if (newPassword !== confirmPassword) {
      return showToast("As senhas não coincidem", "error");
    }

    setIsSubmitting(true);
    try {
      const res = await updatePassword(currentPassword, newPassword);
      if (res.success) {
        showToast("Senha alterada com sucesso!", "success");
        setPasswordForm({ newPassword: "", confirmPassword: "", currentPassword: "" });
        setIsPasswordModalOpen(false);
      } else {
        showToast(res.error || "Falha ao alterar senha", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Falha ao alterar senha", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!usernameForm.newUsername || !usernameForm.currentPassword) {
      return showToast("Preencha o novo username e a senha atual", "warning");
    }

    setIsSubmitting(true);
    try {
      const res = await updateUsername(usernameForm.currentPassword, usernameForm.newUsername);
      if (res.success) {
        showToast("Username alterado com sucesso!", "success");
        setUsernameForm({ newUsername: "", currentPassword: "" });
        setIsUsernameModalOpen(false);
      } else {
        showToast(res.error || "Falha ao alterar username", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Falha ao alterar username", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Configurações da Conta</h1>

      <div className="space-y-6">
        {/* Username */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-6 flex justify-between items-center shadow-md">
          <div>
            <h3 className="font-semibold text-white mb-1">Username</h3>
            <p className="text-gray-300 text-sm">{user?.username}</p>
          </div>
          <button
            onClick={() => setIsUsernameModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors text-sm"
          >
            Alterar Username
          </button>
        </div>

        {/* Email */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-6 flex justify-between items-center shadow-md">
          <div>
            <h3 className="font-semibold text-white mb-1">Email</h3>
            <p className="text-gray-300 text-sm">{user?.email}</p>
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

      {/* Modais */}
      {isUsernameModalOpen && (
        <Modal title="Alterar Username" onClose={() => setIsUsernameModalOpen(false)}>
          <input
            type="text"
            placeholder="Novo username"
            value={usernameForm.newUsername}
            onChange={e => setUsernameForm(prev => ({ ...prev, newUsername: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg mb-2 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Senha atual"
            value={usernameForm.currentPassword}
            onChange={e => setUsernameForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg mb-4 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleUsernameChange}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors w-full"
          >
            {isSubmitting ? "Alterando..." : "Confirmar Alteração"}
          </button>
        </Modal>
      )}

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

      {isDeleteConfirmOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteConfirmOpen(false)} />
      )}
    </div>
  );
}