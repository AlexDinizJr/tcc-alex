import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MediaCarousel from "../../components/MediaCarousel";
import Pagination from "../../components/Pagination";
import { searchMediaByQuery } from "../../services/mediaService";
import RequestButtonModal from "../../components/RequestButtonModal";

export default function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = String(queryParams.get("q") || "").trim();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
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
        const results = await searchMediaByQuery(query);
        setSearchResults(results || []);
        setCurrentPage(1);
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
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-center md:text-left">
            Resultados da busca{query && `: "${query}"`}
          </h1>
        </div>

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
              <div className="text-center py-12 flex flex-col items-center gap-4">
                <p className="text-gray-500 text-lg">Nenhum resultado encontrado. Tente usar termos diferentes.</p>
                <p className="text-gray-400">Não encontrou o que procurava? Conte-nos o que você gostaria para nossa equipe adicionar à base de dados.</p>
                
                {/* Botão de solicitar adição */}
                <RequestButtonModal />
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