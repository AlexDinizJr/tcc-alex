import { useEffect, useState } from "react";
import { SERVICES } from "./StreamingMap";
import { fetchStreamingLinksByMediaId } from "../../services/mediaService";

export default function StreamingServices({ mediaItem }) {
  const [streamingLinks, setStreamingLinks] = useState([]);

  useEffect(() => {
    async function loadLinks() {
      if (!mediaItem?.id) return;

      const response = await fetchStreamingLinksByMediaId(mediaItem.id);
      const links = response?.streamingLinks || [];

      const mappedLinks = links
        .map(link => {
          const serviceData = SERVICES[link.service];
          if (!serviceData) return null;
          return {
            ...link,
            ...serviceData,           // pega icon, color, name etc.
            url: link.url             // mantém a URL que veio do backend
          };
        })
        .filter(Boolean);

      setStreamingLinks(mappedLinks);
    }

    loadLinks();
  }, [mediaItem]);

  const handleStreamingClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (streamingLinks.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-white mb-3">Disponível em:</h3>
      <div className="flex flex-wrap gap-3">
        {streamingLinks.map((service, index) => (
          <button
            key={index}
            onClick={() => handleStreamingClick(service.url)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-colors cursor-pointer ${service.color} hover:scale-105 transform duration-200`}
          >
            {service.icon}
            {service.name}
          </button>
        ))}
      </div>
    </div>
  );
}