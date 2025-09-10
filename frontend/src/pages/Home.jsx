import { useAuth } from "../hooks/useAuth";
import RecommendationGrid from "../components/home/RecommendationGrid";
import TrendingSection from "../components/home/TrendingSection";
import UnauthRecommendationCTA from "../components/home/UnauthRecommendationCTA";
import CustomRecommendationButton from "../components/home/CustomRecommendationButton";
import { FaPlayCircle } from "react-icons/fa";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full flex flex-col items-center px-4 py-8">
      {/* Título principal */}
      <h1 className="text-5xl font-bold mb-6 text-center flex items-center justify-center gap-3">
        <FaPlayCircle className="text-blue-500" size={40} />
        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          MediaHub
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-lg text-gray-400 max-w-2xl mb-8 text-center">
        Descubra novas experiências de <b>filmes</b>, <b>games</b>, <b>músicas</b>,{" "}
        <b>séries de TV</b> e <b>livros</b>.
      </p>

      <div className="w-full max-w-7xl flex flex-col items-center gap-12">
        {isAuthenticated ? (
          <>
            <RecommendationGrid />
            <TrendingSection />
            <CustomRecommendationButton />
          </>
        ) : (
          <UnauthRecommendationCTA />
        )}
      </div>
    </div>
  );
}
