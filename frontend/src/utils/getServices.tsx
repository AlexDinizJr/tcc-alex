import { SERVICES } from "../mockdata/mockServices";

export const getStreamingLinks = (mediaItem) => {
  return mediaItem.streamingLinks?.map(link => ({
    ...SERVICES[link.service],
    url: link.url
  })) || [];
};