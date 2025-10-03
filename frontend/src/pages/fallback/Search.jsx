import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MediaCarousel from "../../components/MediaCarousel";
import Pagination from "../../components/Pagination"; // seu componente de paginação
import { searchMediaByQuery } from "../../services/mediaService";

export default function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = String(queryParams.get("q") || "").trim();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // calcular total de páginas com base nos resultados
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  // slice dos resultados para mostrar apenas a página atual
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setCurrentPage(1);
        return;
      }

      setLoading(true);
      try {
        // busca todos os resultados do backend
        const results = await searchMediaByQuery(query);
        setSearchResults(results || []);
        setCurrentPage(1); // resetar página ao mudar query
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
        setSearchResults([]);
        setCurrentPage(1);
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

            {paginatedResults.length > 0 ? (
              <>
                <MediaCarousel items={paginatedResults} />

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