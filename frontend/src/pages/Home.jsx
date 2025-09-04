import RecommendationGrid from "../components/RecommendationGrid";
import { useAuth } from "../hooks/useAuth";
import TrendingSection from "../components/TrendingSection";
import UnauthRecommendationCTA from "../components/UnauthRecommendationCTA";
import CustomRecommendationButton from "../components/CustomRecommendationButton";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      <h1 className="text-5xl font-bold mb-6 bg-blue-600 bg-clip-text text-transparent">
        MediaHub 🎬🎮🎵📺📚
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl">
        Conheça novas experiências de <b>filmes</b>, <b>games</b>, <b>músicas</b>,{" "}
        <b>séries de TV</b> e <b>livros</b>.
      </p>

      <div className="p-4 w-full flex flex-col items-center">
        {/* Grid de Recomendações */}
        {isAuthenticated && <RecommendationGrid />}

        {/* Grid de Trendings */}
        {isAuthenticated && <TrendingSection />}

        {/* Link para ferramenta de recomendações customizáveis */}
        {isAuthenticated && <CustomRecommendationButton />}

        {/* CTA para usuários não autenticados */}
        {!isAuthenticated && <UnauthRecommendationCTA />}

      </div>
    </div>
  );
}