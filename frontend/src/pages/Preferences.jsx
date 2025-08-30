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
    // Aqui futuramente você vai enviar os dados pro backend
    console.log("Preferências escolhidas:", selected);
    goToProfile();
  };

  const handleSkip = () => {
    goToProfile();
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Escolha até 10 mídias favoritas
        </h1>

      <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
        {ALL_MEDIA.slice(0, 30).map((media) => (
          <div
            key={media.id}
            onClick={() => toggleSelect(media.id)}
            className={`cursor-pointer border rounded-xl p-3 text-center transition 
              ${
                selected.includes(media.id)
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white hover:bg-gray-50 border-gray-200"
              }
            `}
          >
            <p className="font-semibold text-xs mb-1 line-clamp-2">{media.title}</p>
            <span className="text-xs text-gray-500 block">{media.type}</span>
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
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 cursor-pointer"
          >
            Confirmar Seleção ({selected.length}/10)
          </button>

          <button
            onClick={handleSkip}
            className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
          >
            Pular
          </button>
        </div>
      </div>
    </div>
  );
}
