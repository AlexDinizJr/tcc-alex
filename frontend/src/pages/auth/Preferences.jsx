import { useState, useEffect } from "react";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { fetchMediaFiltered } from "../../services/mediaService";
import { useToast } from "../../hooks/useToast";
import { buildUserInitialPreferences } from "../../services/recommendationService";

export default function Preferences() {
  const [allMedia, setAllMedia] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const { goHome } = useAppNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const loadTopMedia = async () => {
      try {
        console.log("🔄 Buscando 10 mídias de cada tipo...");

        // Busca 10 de cada tipo em paralelo
        const [movies, series, games, books, musics] = await Promise.all([
          fetchMediaFiltered({ type: "MOVIE", sortBy: "rating", limit: 10 }),
          fetchMediaFiltered({ type: "SERIES", sortBy: "rating", limit: 10 }),
          fetchMediaFiltered({ type: "GAME", sortBy: "rating", limit: 10 }),
          fetchMediaFiltered({ type: "MUSIC", sortBy: "rating", limit: 10 }),
          fetchMediaFiltered({ type: "BOOK", sortBy: "rating", limit: 10 }),
        ]);
        // Combina todos os resultados
        const allItems = [
          ...(movies.media || []),
          ...(series.media || []),
          ...(games.media || []),
          ...(books.media || []),
          ...(musics.media || [])
        ];

        console.log("🎬 Total de mídias carregadas:", allItems.length);
        
        if (allItems.length === 0) {
          console.warn("❌ Nenhuma mídia encontrada");
        } else {
          setAllMedia(allItems);
        }

      } catch (err) {
        console.error("💥 Erro ao carregar mídias:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTopMedia();
  }, []);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 10) {
      setSelected([...selected, id]);
    } else {
      showToast("Máximo de 10 mídias selecionadas", "info");
    }
  };

  const handleSkip = () => {
    goHome();
  };

  const handleConfirm = async () => {
    if (!selected.length) {
      showToast("Selecione pelo menos uma mídia", "warning");
      return;
    }

    try {
      console.log("Preferências escolhidas:", selected);
      await buildUserInitialPreferences(selected);
      showToast("Preferências salvas com sucesso!", "success");
      goHome();
    } catch (err) {
      console.error("Erro ao salvar preferências iniciais:", err);
      showToast("Erro ao salvar preferências iniciais", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Carregando mídias...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-3xl w-full bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700/50">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          Escolha até 10 mídias favoritas
        </h1>

        {allMedia.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Nenhuma mídia disponível</p>
            <button
              onClick={handleSkip}
              className="px-6 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-white transition-colors duration-200"
            >
              Voltar para Home
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-2">
              {allMedia.map((media) => (
                <div
                  key={media.id}
                  onClick={() => toggleSelect(media.id)}
                  className={`cursor-pointer border rounded-xl p-3 text-center transition-all duration-200
                    ${
                      selected.includes(media.id)
                        ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                        : "bg-gray-700/60 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                    }
                  `}
                >
                  <p className="font-semibold text-xs mb-1 line-clamp-2">{media.title}</p>
                  <span className="text-xs text-gray-300 block capitalize">{media.type || 'Sem tipo'}</span>
                  {media.year && <span className="text-xs text-gray-400">({media.year})</span>}
                  {media.rating && (
                    <span className="text-xs text-yellow-400 block mt-1">
                      ⭐ {media.rating}
                    </span>
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
          </>
        )}
      </div>
    </div>
  );
}