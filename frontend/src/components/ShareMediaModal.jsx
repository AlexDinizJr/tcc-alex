import { FiX, FiCopy, FiLink } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Portal from "./Portal";
import { useToast } from "../hooks/useToast";

export default function ShareMediaModal({ isOpen, onClose, media }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const mediaLink = `${window.location.origin}/media/${media.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mediaLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Falha ao copiar o link", "error");
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={20} />,
      url: `https://wa.me/?text=${encodeURIComponent(`Confira "${media.title}" no MediaHub! ${mediaLink}`)}`,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "",
      icon: <FaXTwitter size={20} />,
      url: `https://x.com/intent/tweet?text=${encodeURIComponent(`Confira "${media.title}" no MediaHub! ${mediaLink}`)}`,
      color: "bg-black",
    },
    {
      name: "Facebook",
      icon: <FaFacebookF size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaLink)}&quote=${encodeURIComponent(`Confira "${media.title}" no MediaHub!`)}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Telegram",
      icon: <FaTelegramPlane size={20} />,
      url: `https://t.me/share/url?url=${encodeURIComponent(mediaLink)}&text=${encodeURIComponent(`Confira "${media.title}" no MediaHub!`)}`,
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ];

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <FiLink className="text-blue-400 text-xl" />
              </div>
              <h2 className="text-xl font-bold text-white">Compartilhar</h2>
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
              src={media.image}
              alt={media.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{media.title}</h3>
              <p className="text-gray-400 text-sm">
                {media.type} • {media.year}
              </p>
            </div>
          </div>

          {/* Campo do link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Link para compartilhar
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={mediaLink}
                  readOnly
                  className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  onClick={(e) => e.target.select()}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FiLink className="text-gray-500" />
                </div>
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 min-w-[100px] justify-center ${
                  copied 
                    ? "bg-green-600 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <FiCopy size={16} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <FiCopy size={16} />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Redes sociais */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-4 text-center">
              Compartilhar via
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 flex items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-110 ${option.color}`}
                  title={option.name} // mostra o nome ao passar o mouse
                >
                  {option.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              O link fornece acesso público a esta mídia
            </p>
          </div>
        </div>
      </div>
    </Portal>
  );
}