import { SERVICES } from "../mockdata/mockServices";

// Busca os links da midia para gerar os botões
export const getStreamingLinks = (mediaItem) => {
  return mediaItem.streamingLinks?.map(link => ({
    ...SERVICES[link.service],
    url: link.url
  })) || [];
};