import { useState } from "react";
import { CiSquareQuestion } from "react-icons/ci";
import { sendRequest } from "../services/reportService";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

export default function RequestButtonModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    requestType: "",
    details: ""
  });
  const [loading, setLoading] = useState(false);
  useLockBodyScroll(isOpen);

  const { user } = useAuth();
  const { showToast } = useToast(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      alert("Você precisa estar logado para enviar um pedido.");
      return;
    }

    setLoading(true);
    try {
      await sendRequest({
        userEmail: user.email,
        requestType: formData.requestType,
        details: formData.details
      });

      showToast("Pedido enviado com sucesso!", "success");
      setIsOpen(false);
      setFormData({ requestType: "", details: "" });
    } catch (err) {
      console.error("Erro ao enviar pedido:", err);
      showToast("Erro ao enviar pedido. Tente novamente mais tarde.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Botão discreto apenas com ícone */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-gray-700/80 hover:bg-gray-600 text-white shadow-md transition-colors cursor-pointer"
        title="Enviar pedido"
      >
        <CiSquareQuestion className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-modalPop">
            <h2 className="text-xl font-bold text-white mb-4">Enviar pedido</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Tipo de pedido
                </label>
                <select
                  value={formData.requestType}
                  onChange={(e) =>
                    setFormData({ ...formData, requestType: e.target.value })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="feature">Nova funcionalidade</option>
                  <option value="content">Adicionar conteúdo</option>
                  <option value="bug">Reportar bug</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Detalhes do pedido
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 h-24"
                  placeholder="Descreva seu pedido..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-500 text-white"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-500 text-white"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}