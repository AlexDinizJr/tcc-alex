import { useAuth } from "../hooks/useAuth";
import MediaGrid from "../components/MediaGrid";
import { convertMediaIdsToObjects } from "../utils/MediaHelpers";

export default function MyFavorites() {
  const { user } = useAuth();

const favoritesItems = convertMediaIdsToObjects(user?.favorites);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Favoritos</h1>
          <p className="text-gray-600">{favoritesItems.length} favoritos </p>
        </div>

        <MediaGrid 
          items={favoritesItems}
          emptyMessage="Você ainda não favoritou nenhum item."
        />
      </div>
    </div>
  );
}