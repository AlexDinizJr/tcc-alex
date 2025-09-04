// components/CustomRecommendationButton.jsx
import { Link } from "react-router-dom";

export default function CustomRecommendationButton() {
  return (
    <div className="text-center my-12">
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🎯 Procurando algo mais específico?
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Use nossa ferramenta avançada para criar recomendações super específicas 
          por gênero, plataforma, ano, duração e muito mais!
        </p>
        
        <Link
          to="/custom-recommendations"
          className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-lg group"
        >
          <span className="mr-3">⚙️</span>
          Criar Recomendações Personalizadas
          <svg 
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        
        <p className="text-sm text-gray-500 mt-4">
          Filtre por: Gênero • Plataforma • Ano • Classificação • Duração • e muito mais!
        </p>
      </div>
    </div>
  );
}