import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ALL_MEDIA } from "../../mockdata/mockMedia";
import MediaGrid from "../../components/contents/MediaGrid";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  useEffect(() => {
    if (query) {
      const results = ALL_MEDIA.filter((media) =>
        media.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query, location.search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Resultados da busca{query && `: "${query}"`}
        </h1>
        
        {query ? (
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