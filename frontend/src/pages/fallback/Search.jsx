import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MediaGrid from "../../components/contents/MediaGrid";
import Pagination from "../../components/Pagination"
import api from "../../services/api";

export default function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalResults(0);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/media/search", {
          params: { q: query, page: currentPage, limit: itemsPerPage },
        });

        const { results, pagination } = response.data;

        setSearchResults(Array.isArray(results) ? results : []);
        setTotalPages(pagination?.pages || 1);
        setTotalResults(pagination?.total || 0); // <-- total de resultados
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
        setSearchResults([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

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
              {totalResults} resultado(s) encontrado(s)
            </p>

            {searchResults.length > 0 ? (
              <>
                <MediaGrid items={searchResults} />

                {/* Paginação */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
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