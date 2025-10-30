import { useState } from "react";
import { createPortal } from "react-dom";
import { recoverPassword } from "../../services/authService";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await recoverPassword(email);

    if (result.success) {
      setMessage("E-mail enviado com sucesso! Verifique sua caixa de entrada.");
      setEmail("");
      setTimeout(() => {
        setMessage("");
        onClose(); // fecha o modal após exibir a mensagem
      }, 2000);
    } else {
      setMessage(result.error || "Erro ao enviar e-mail. Tente novamente.");
    }

    setLoading(false);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md animate-modalPop">
        <h2 className="text-white text-lg font-semibold mb-4">Recuperar senha</h2>
        <p className="text-gray-300 text-sm mb-4">
          Insira seu e-mail para receber o link de recuperação
        </p>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-sm font-medium ${
              message.includes("sucesso")
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full p-3 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}