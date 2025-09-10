import { ALL_MEDIA } from "../mockdata/mockMedia";
import { SERVICES } from "../mockdata/mockServices";

/**
 * Busca os links de streaming de uma mídia
 * @param {Object} mediaItem - Objeto da mídia
 * @returns {Promise<Array>} Lista de serviços com {name, icon, color, url}
 */
export async function fetchStreamingLinks(mediaItem) {
  await new Promise(res => setTimeout(res, 200)); // simula latência

  // Se não houver streamingLinks, tenta buscar no mock
  const targetMedia = mediaItem.streamingLinks 
    ? mediaItem 
    : ALL_MEDIA.find(m => m.id === mediaItem.id) || mediaItem;

  if (!targetMedia.streamingLinks) return [];

  return targetMedia.streamingLinks.map(link => ({
    ...SERVICES[link.service],
    url: link.url
  }));
}
