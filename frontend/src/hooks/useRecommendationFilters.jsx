import { useMemo, useState, useEffect } from "react";
import { fetchMedia, fetchAvailableStreamingServices } from "../services/mediaService";

export function useRecommendationFilters() {
  const [allMedia, setAllMedia] = useState([]);
  const [streamingServices, setStreamingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Buscando dados para filtros...");
        
        const [mediaResult, servicesResult] = await Promise.all([
          loadAllMedia(),
          fetchAvailableStreamingServices().catch(err => {
            console.error("❌ Erro ao buscar serviços de streaming:", err);
            return [];
          })
        ]);
        
        setAllMedia(mediaResult);
        
        // DEBUG dos serviços
        console.log("🔍 servicesResult:", servicesResult);
        
        // Extrai nomes das plataformas de várias estruturas possíveis
        let servicesArray = extractPlatformNames(servicesResult);
        console.log("🎯 Nomes extraídos das plataformas:", servicesArray);
        
        setStreamingServices(servicesArray);
        
      } catch (err) {
        console.error("❌ Erro ao carregar dados para filtros:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Função para extrair nomes de plataformas de diferentes estruturas
  const extractPlatformNames = (data) => {
    if (!data) return [];
    
    let items = [];
    
    // Se for array, processa cada item
    if (Array.isArray(data)) {
      items = data;
    } 
    // Se for objeto com propriedades específicas
    else if (data.services && Array.isArray(data.services)) {
      items = data.services;
    } else if (data.data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data.items && Array.isArray(data.items)) {
      items = data.items;
    } else if (typeof data === 'object') {
      // Se for um objeto simples, usa seus valores
      items = Object.values(data);
    }
    
    // Extrai nomes de cada item
    const names = items.map(item => {
      if (typeof item === 'string') {
        return item.trim();
      } else if (item && typeof item === 'object') {
        // Tenta várias propriedades possíveis
        return item.name || item.service || item.title || item.platform || 
               item.label || JSON.stringify(item);
      }
      return String(item);
    }).filter(name => name && name !== '{}'); // Remove vazios e objetos vazios
    
    // Remove duplicatas
    return [...new Set(names)].sort();
  };

  const loadAllMedia = async () => {
    let allItems = [];
    let currentPage = 1;
    let hasMore = true;
    
    while (hasMore) {
      const result = await fetchMedia({ 
        page: currentPage, 
        itemsPerPage: 100 
      });
      
      const items = result.items || [];
      allItems = [...allItems, ...items];
      
      const totalPages = Math.ceil((result.total || 0) / 100);
      hasMore = currentPage < totalPages && items.length > 0;
      currentPage++;
      
      if (currentPage > 50) break;
    }
    
    return allItems;
  };

  // Extrai tipos únicos das mídias
  const mediaTypes = useMemo(() => {
    if (loading) return [];
    if (allMedia.length === 0) return [];
    
    const typeSet = new Set();
    allMedia.forEach((media) => {
      if (media.type) typeSet.add(media.type.toString().trim());
    });
    
    return Array.from(typeSet).sort();
  }, [allMedia, loading]);

  // Extrai gêneros únicos
  const genres = useMemo(() => {
    if (loading) return [];
    if (allMedia.length === 0) return [];
    
    const genreCount = {};
    allMedia.forEach((media) => {
      if (media.genres && Array.isArray(media.genres)) {
        media.genres.forEach(genre => {
          if (genre && genre.toString().trim()) {
            const normalizedGenre = genre.toString().trim();
            genreCount[normalizedGenre] = (genreCount[normalizedGenre] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .map(([genre]) => genre);
  }, [allMedia, loading]);

  // Extrai classificações etárias
  const classifications = useMemo(() => {
    if (loading) return [];
    if (allMedia.length === 0) return [];
    
    const classificationSet = new Set();
    allMedia.forEach((media) => {
      if (media.classification) classificationSet.add(media.classification.toString().trim());
      if (media.ageRating) classificationSet.add(media.ageRating.toString().trim());
    });
    
    return Array.from(classificationSet).sort();
  }, [allMedia, loading]);

  // Plataformas - já extraídas como strings
  const platforms = useMemo(() => {
    if (loading) return [];
    
    console.log("🎯 Platforms final:", streamingServices);
    
    // Se temos serviços extraídos, usa eles
    if (Array.isArray(streamingServices) && streamingServices.length > 0) {
      return streamingServices;
    }
    
    // Fallback: extrai das mídias
    const platformSet = new Set();
    allMedia.forEach((media) => {
      if (media.streamingLinks && Array.isArray(media.streamingLinks)) {
        media.streamingLinks.forEach(link => {
          if (link && link.service) {
            platformSet.add(link.service.toString().trim());
          }
        });
      }
    });
    
    const fallbackPlatforms = Array.from(platformSet).sort();
    
    // Fallback final: lista fixa
    return fallbackPlatforms.length > 0 ? fallbackPlatforms : 
      ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Spotify', 'YouTube'];
  }, [streamingServices, allMedia, loading]);

  return { 
    mediaTypes, 
    genres, 
    platforms, 
    classifications,
    loading,
    error
  };
}