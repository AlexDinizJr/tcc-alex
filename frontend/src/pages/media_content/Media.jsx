import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMediaById } from "../../services/mediaService";
import { fetchSimilarMedia } from "../../services/recommendationService";
import { useAuth } from "../../hooks/useAuth";

import MediaGrid from "../../components/contents/MediaGrid";
import MediaHeader from "../../components/media/MediaHeader";
import ReviewSection from "../../components/media/ReviewSection";

export default function MediaPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [mediaItem, setMediaItem] = useState(null);
  const [similarMedia, setSimilarMedia] = useState([]);

  useEffect(() => {
    async function loadMedia() {
      try {
        const media = await fetchMediaById(Number(id));
        setMediaItem(media);
        if (!media) return;

        const similarResponse = await fetchSimilarMedia(media.id);

        // Já é um array
        const similarArray = Array.isArray(similarResponse) ? similarResponse : [];

        // Normaliza para o MediaGrid
        const normalizedSimilar = similarArray.map((item) => ({
          id: item.id,
          title: item.title || "Sem título",
          image: item.image || "/placeholder.png",
          type: item.type || media.type,
          rating: item.rating || 0,
        }));

        setSimilarMedia(normalizedSimilar);
        console.log("Normalized Similar:", normalizedSimilar); // agora deve mostrar 6 itens
      } catch (error) {
        console.error("Erro ao carregar mídia ou similares:", error);
      }
    }

    loadMedia();
  }, [id]);

  if (!mediaItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Mídia não encontrada</h1>
        <p className="text-gray-400 text-lg">
          O item solicitado não existe em nossa base de dados.
        </p>
      </div>
    );
  }

  const description =
    mediaItem.description || "Descrição detalhada não disponível.";

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <MediaHeader mediaItem={mediaItem} description={description} />

        {/* Reviews (refatorado para ReviewSection) */}
        <ReviewSection mediaId={mediaItem.id} currentUser={user} />

        {/* Similar Media */}
        {similarMedia.length > 0 && (
          <div className="bg-gray-800/80 rounded-2xl shadow-md border border-gray-700/50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Similares
            </h2>
            <MediaGrid items={similarMedia} />
          </div>
        )}
      </div>
    </div>
  );
}