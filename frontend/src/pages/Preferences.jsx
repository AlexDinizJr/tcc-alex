import { useState } from "react";
import { useAppNavigate } from "../hooks/useAppNavigate";
import { ALL_MEDIA } from "../mockdata/mockMedia";

export default function Preferences() {
  const [selected, setSelected] = useState([]);
  const { goToProfile } = useAppNavigate();

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 10) {
      setSelected([...selected, id]);
    }
  };

  const handleConfirm = () => {
    console.log("Preferências escolhidas:", selected);
    goToProfile();
  };

  const handleSkip = () => {
    goToProfile();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
      <div className="max-w-3xl w-full bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700/50">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Escolha até 10 mídias favoritas
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-2">
          {ALL_MEDIA.slice(0, 30).map((media) => (
            <div
              key={media.id}
              onClick={() => toggleSelect(media.id)}
              className={`cursor-pointer border rounded-xl p-3 text-center transition-all duration-200
                ${
                  selected.includes(media.id)
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-700/60 text-white border-gray-600 hover:bg-gray-700"
                }
              `}
            >
              <p className="font-semibold text-xs mb-1 line-clamp-2">{media.title}</p>
              <span className="text-xs text-gray-300 block">{media.type}</span>
              {media.year && (
                <span className="text-xs text-gray-400">({media.year})</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleConfirm}
            disabled={selected.length === 0}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Confirmar ({selected.length}/10)
          </button>

          <button
            onClick={handleSkip}
            className="px-6 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white transition-colors duration-200"
          >
            Pular
          </button>
        </div>
      </div>

      {/* Scrollbar dark */}
      <style jsx>{`
        .max-h-[600px]::-webkit-scrollbar {
          width: 8px;
        }
        .max-h-[600px]::-webkit-scrollbar-track {
          background: transparent;
        }
        .max-h-[600px]::-webkit-scrollbar-thumb {
          background-color: rgba(100,100,100,0.5);
          border-radius: 4px;
        }
        .max-h-[600px]::-webkit-scrollbar-thumb:hover {
          background-color: rgba(150,150,150,0.7);
        }
      `}</style>
    </div>
  );
}