import { useState, useEffect } from "react";
import MediaCarousel from "../MediaCarousel";
import { IoMdTrendingUp } from "react-icons/io";
import { fetchTrending } from "../../services/mediaService";

export default function TrendingSection() {
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTrending();
        setTrendingItems(data);
      } catch {
        setError("Não foi possível carregar os trending items.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrending();
  }, []);

  return (
    <div className="w-full mb-8 flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <IoMdTrendingUp className="w-6 h-6 text-blue-500" />
        Trendings
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <MediaCarousel items={trendingItems} />

      {isLoading && <p className="text-gray-400 mt-2">Carregando...</p>}
    </div>
  );
}
