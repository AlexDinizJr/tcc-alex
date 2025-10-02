import { useState, useEffect } from "react";
import MediaCarousel from "../MediaCarousel";
import { IoMdTrendingUp } from "react-icons/io";
import { fetchTrending } from "../../services/recommendationService";

export default function TrendingSection() {
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrending() {
      try {
        setError(null);
        const data = await fetchTrending();
        console.log("Trending API response:", data);
        if (isMounted) setTrendingItems(Array.isArray(data) ? data : data?.data || []);
      } catch {
        if (isMounted) setError("Não foi possível carregar os trending items.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTrending();
    return () => {
      isMounted = false; 
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <IoMdTrendingUp className="w-6 h-6 text-blue-500" />
        Trendings
      </h2>

      {isLoading && <p className="text-gray-400">Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && trendingItems.length > 0 && (
        <MediaCarousel items={trendingItems} />
      )}

      {!isLoading && !error && trendingItems.length === 0 && (
        <p className="text-gray-400">Nenhum item encontrado.</p>
      )}
    </div>
  );
}