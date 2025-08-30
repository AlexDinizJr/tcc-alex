import { useAuth } from "../hooks/useAuth";
import MediaGrid from "../components/MediaGrid";
import { convertMediaIdsToObjects } from "../utils/MediaHelpers";

export default function SavedItems() {
  const { user } = useAuth();

const savedMediaItems = convertMediaIdsToObjects(user?.savedMedia);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Itens Salvos</h1>
          <p className="text-gray-600">{savedMediaItems.length} itens salvos</p>
        </div>

        <MediaGrid 
          items={savedMediaItems} // Agora passando objetos completos
          emptyMessage="Você ainda não salvou nenhum item."
        />
      </div>
    </div>
  );
}