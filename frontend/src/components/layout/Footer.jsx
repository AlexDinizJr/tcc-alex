import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        
        {/* Conteúdo do Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">RecommendationHub</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Sua plataforma completa para descobrir, avaliar e explorar o melhor do entretenimento.
            </p>
            <div className="flex space-x-4">
              {/* Ícones sociais */}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Navegação</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">Início</Link></li>
              <li><Link to="/movies" className="text-gray-300 hover:text-blue-400 transition-colors">Filmes</Link></li>
              <li><Link to="/tvseries" className="text-gray-300 hover:text-blue-400 transition-colors">Séries</Link></li>
              <li><Link to="/musics" className="text-gray-300 hover:text-blue-400 transition-colors">Musicas</Link></li>
              <li><Link to="/games" className="text-gray-300 hover:text-blue-400 transition-colors">Jogos</Link></li>
              <li><Link to="/books" className="text-gray-300 hover:text-blue-400 transition-colors">Livros</Link></li>
              <li><Link to="/users" className="text-gray-300 hover:text-blue-400 transition-colors">Usuários</Link></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Ajuda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Contato</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Sobre</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Newsletter</h4>
            <p className="text-gray-300 mb-4">Receba as novidades em primeira mão</p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Divisor e Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 MediaHub. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}