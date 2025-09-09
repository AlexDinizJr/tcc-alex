import { Link } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import StepCard from "./StepCard";
import { FaRobot, FaMapMarkerAlt, FaListAlt, FaStar, FaComments, FaCogs } from "react-icons/fa";

export default function UnauthRecommendationCTA() {
  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-12 px-4">
      {/* Seção Principal - Estilo consistente com User Card */}
      <div className="bg-gray-800/80 rounded-2xl shadow-md p-8 text-center border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Sua Jornada de Descoberta de Mídias Começa Aqui
        </h2>
        <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
          Descubra, organize e explore um universo de entretenimento personalizado 
          com recomendações inteligentes baseadas no seu gosto único.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg border border-blue-500/50"
          >
            Começar Agora - Grátis
          </Link>
          <Link
            to="/login"
            className="border-2 border-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700/50 transition-all duration-300 font-semibold text-lg"
          >
            Já Tenho Conta
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          ⚡ Cadastro em 30 segundos • 🔒 Privacidade garantida • 🎁 Sem custos
        </p>
      </div>

      {/* Grid de Funcionalidades */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<FaRobot className="w-6 h-6 text-blue-400" />}
          title="Recomendações Inteligentes"
          description="Algoritmos que aprendem com seus gostos para sugerir filmes, séries, games, músicas e livros perfeitos para você."
          bgColor="bg-gray-800/80"
          textColor="text-white"
          borderColor="border-gray-700/50"
        />
        <FeatureCard
          icon={<FaMapMarkerAlt className="w-6 h-6 text-blue-400" />}
          title="Disponibilidade nas Plataformas"
          description="Veja onde cada mídia está disponível - streaming, lojas online, e muito mais."
          bgColor="bg-gray-800/80"
          textColor="text-white"
          borderColor="border-gray-700/50"
        />
        <FeatureCard
          icon={<FaListAlt className="w-6 h-6 text-blue-400" />}
          title="Listas Personalizadas"
          description="Crie listas temáticas, organize seus favoritos."
          bgColor="bg-gray-800/80"
          textColor="text-white"
          borderColor="border-gray-700/50"
        />
        <FeatureCard
          icon={<FaStar className="w-6 h-6 text-blue-400" />}
          title="Salve para Mais Tarde"
          description="Marque itens para ver depois e nunca perca uma recomendação interessante."
          bgColor="bg-gray-800/80"
          textColor="text-white"
          borderColor="border-gray-700/50"
        />
        <FeatureCard
          icon={<FaComments className="w-6 h-6 text-blue-400" />}
          title="Avaliações e Reviews"
          description="Compartilhe suas opiniões e descubra o que outros usuários estão achando."
          bgColor="bg-gray-800/80"
          textColor="text-white"
          borderColor="border-gray-700/50"
        />
        <FeatureCard
          icon={<FaCogs className="w-6 h-6 text-blue-400" />}
          title="Recomendações Customizáveis"
          description="Use nossa ferramenta avançada para refinar suas buscas por gênero, ano, plataforma e muito mais."
          bgColor="bg-gray-800/80"
          textColor="text-white"
          borderColor="border-gray-700/50"
        />
      </div>

      {/* Seção de Como Funciona */}
      <div className="bg-gray-800/80 rounded-2xl shadow-md p-8 border border-gray-700/50">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Como o MediaHub Transforma Sua Experiência
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            number="1"
            title="Conte Seus Gostos"
            description="Informe suas preferências e avalie conteúdos que você já conhece."
            bgColor="bg-gray-800/80"
            textColor="text-white"
            borderColor="border-gray-700/50"
          />
          <StepCard
            number="2"
            title="Receba Recomendações"
            description="Nosso sistema analisa e sugere conteúdos perfeitos para seu perfil."
            bgColor="bg-gray-800/80"
            textColor="text-white"
            borderColor="border-gray-700/50"
          />
          <StepCard
            number="3"
            title="Explore e Descubra"
            description="Organize, salve e compartilhe suas descobertas com a comunidade."
            bgColor="bg-gray-800/80"
            textColor="text-white"
            borderColor="border-gray-700/50"
          />
        </div>
      </div>

      {/* Call-to-Action Final */}
      <div className="bg-gray-800/80 rounded-2xl shadow-md p-8 text-center border border-gray-700/50">
        <h3 className="text-2xl font-bold text-white mb-4">
          Pronto para Descobrir Seu Próximo Favorito?
        </h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Junte-se a outros usuários que já encontraram suas próximas obsessões 
          através do MediaHub.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg shadow-md hover:shadow-lg border border-blue-500/50"
          >
            Criar Minha Conta
          </Link>
          <Link
            to="/login"
            className="border-2 border-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700/50 transition-colors font-semibold text-lg"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
}