import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import StepCard from "./StepCard";

export default function UnauthRecommendationCTA() {
  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-8">
      {/* Seção Principal */}
      <div className="bg-blue-700 rounded-2xl shadow-2xl p-8 text-center text-white">
        <div className="text-6xl mb-6">🎬🎮🎵📺📚</div>
        
        <h2 className="text-3xl font-bold mb-4">
          Sua Jornada de Descoberta de Mídias Começa Aqui
        </h2>
        
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Descubra, organize e explore um universo de entretenimento personalizado 
          com recomendações inteligentes baseadas no seu gosto único.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Começar Agora - Grátis
          </Link>
          
          <Link
            to="/login"
            className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-semibold text-lg"
          >
            Já Tenho Conta
          </Link>
        </div>

        <p className="text-sm opacity-80 mt-6">
          ⚡ Cadastro em 30 segundos • 🔒 Privacidade garantida • 🎁 Sem custos
        </p>
      </div>

      {/* Grid de Funcionalidades */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recomendações Inteligentes */}
        <FeatureCard
          icon="🤖"
          title="Recomendações Inteligentes"
          description="Algoritmos que aprendem com seus gostos para sugerir filmes, séries, games, músicas e livros perfeitos para você."
        />

        {/* Onde Assistir/Comprar */}
        <FeatureCard
          icon="📍"
          title="Disponibilidade nas Plataformas"
          description="Veja onde cada mídia está disponível - streaming, lojas online, e muito mais."
        />

        {/* Listas Personalizadas */}
        <FeatureCard
          icon="📋"
          title="Listas Personalizadas"
          description="Crie listas temáticas, organize seus favoritos."
        />

        {/* Salvamento para Depois */}
        <FeatureCard
          icon="⭐"
          title="Salve para Mais Tarde"
          description="Marque itens para ver depois e nunca perca uma recomendação interessante."
        />

        {/* Avaliações Personalizadas */}
        <FeatureCard
          icon="💬"
          title="Avaliações e Reviews"
          description="Compartilhe suas opiniões e descubra o que outros usuários estão achando."
        />

        {/* Recomendações Customizadas */}
        <FeatureCard
          icon="🎯"
          title="Recomendações Customizáveis"
          description="Use nossa ferramenta avançada para refinar suas buscas por gênero, ano, plataforma e muito mais."
        />
      </div>

      {/* Seção de Como Funciona */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Como o MediaHub Transforma Sua Experiência
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="1"
            title="Conte Seus Gostos"
            description="Informe suas preferências e avalie conteúdos que você já conhece."
          />
          
          <StepCard
            number="2"
            title="Receba Recomendações"
            description="Nosso sistema analisa e sugere conteúdos perfeitos para seu perfil."
          />
          
          <StepCard
            number="3"
            title="Explore e Descubra"
            description="Organize, salve e compartilhe suas descobertas com a comunidade."
          />
        </div>
      </div>

      {/* Call-to-Action Final */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Pronto para Descobrir Seu Próximo Favorito?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Junte-se a outros usuários que já encontraram suas próximas obsessões 
          através do MediaHub.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
          >
            Criar Minha Conta
          </Link>
          
          <Link
            to="/login"
            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-lg"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
}