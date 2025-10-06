import { useState } from "react";
import { MdOutlineReport } from "react-icons/md";
import { reportIssue, sendRequest } from "../../services/reportService";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

export default function ReportButtonModal({ mediaItem, type = "report" }) {
  const { user } = useAuth();
  const { showToast } = useToast(); 

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    issue: "",       // para report
    details: "",     // detalhes gerais
    requestType: ""  // para pedidos
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useLockBodyScroll(isOpen);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      showToast("Você precisa estar logado para enviar.", "error");
      return;
    }

    if (type === "report" && (!mediaItem || !mediaItem.id)) {
      showToast("Não é possível reportar sem uma mídia selecionada.", "error");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (type === "report") {
        await reportIssue({
          mediaId: mediaItem.id,
          mediaTitle: mediaItem.title,
          issueType: formData.issue || "Outro",       // agora corresponde ao backend
          description: formData.details || "",        // agora corresponde ao backend
          userEmail: user.email,
        });
        setSuccessMessage("Relatório enviado com sucesso!");
      } else if (type === "request") {
        await sendRequest({
          requestType: formData.requestType || "Outro",
          details: formData.details || "",
          userEmail: user.email,
        });
        setSuccessMessage("Pedido enviado com sucesso!");
      }

      // resetar formulário e fechar modal após 1.5s
      setFormData({ issue: "", details: "", requestType: "" });
      setTimeout(() => setIsOpen(false), 1500);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      setErrorMessage("Erro ao enviar. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bottom-2 left-2 mt-4">
      {/* Botão discreto com ícone */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full bg-gray-700/80 hover:bg-gray-600 text-white shadow-md transition-colors"
        title={type === "report" ? "Reportar problema" : "Enviar pedido"}
      >
        <MdOutlineReport className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {type === "report" ? "Reportar problema" : "Enviar pedido"}
            </h2>

            {successMessage && <p className="text-green-400 mb-2">{successMessage}</p>}
            {errorMessage && <p className="text-red-400 mb-2">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {type === "report" ? (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Tipo do problema</label>
                  <select
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                    required
                    autoFocus
                  >
                    <option value="">Selecione</option>
                    <option value="info">Informações incorretas</option>
                    <option value="image">Imagem com problema</option>
                    <option value="link">Links indisponíveis</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Tipo de pedido</label>
                  <input
                    type="text"
                    value={formData.requestType}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                    required
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm mb-1">Detalhes adicionais</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 h-24"
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
                  className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white"
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