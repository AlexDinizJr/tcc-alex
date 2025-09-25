import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MediaGrid from "../../components/contents/MediaGrid";
import api from "../../services/api"; // seu axios instance

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/media/search", {
          params: { q: query }
        });

        setSearchResults(Array.isArray(response.data.results) ? response.data.results : []);
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Resultados da busca{query && `: "${query}"`}
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Carregando resultados...</p>
        ) : query ? (
          <>
            <p className="text-gray-600 mb-6 text-center">
              {searchResults.length} resultado(s) encontrado(s)
            </p>
            
            {searchResults.length > 0 ? (
              <MediaGrid items={searchResults} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum resultado encontrado.</p>
                <p className="text-gray-400 mt-2">Tente usar termos diferentes.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Digite algo para buscar.</p>
          </div>
        )}
      </div>
    </div>
  );
}