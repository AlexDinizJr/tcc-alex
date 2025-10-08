import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import RequestButtonModal from "../RequestButtonModal";
import SimpleModal from "../SimpleModal";

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Fake: limpa o campo e mostra toast
    setEmail("");
    showToast("Inscrição realizada com sucesso!", "success");
  };

  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Conteúdo do Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">MediaHub</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Sua plataforma completa para descobrir, avaliar e explorar o melhor do entretenimento.
            </p>
            <div className="flex space-x-4">
              {/* Aqui você pode colocar ícones sociais */}
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
              <li><Link to="/lists" className="text-gray-300 hover:text-blue-400 transition-colors">Listas</Link></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300 flex items-center justify-between">
              Suporte
            </h4>
            <ul className="space-y-2">
              <li>
              <RequestButtonModal/>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Newsletter</h4>
            <p className="text-gray-300 mb-4">Receba as novidades em primeira mão</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Inscrever-se
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
              
              <SimpleModal
                triggerText="Termos de Uso"
                title="Termos de Uso"
                content={`Bem-vindo ao MediaHub! Ao utilizar nossa plataforma, você concorda com os termos e condições descritos aqui. 
                Estes termos regem o uso do site, serviços e conteúdos oferecidos, incluindo regras sobre acesso, comportamento dos usuários e responsabilidade pelo uso das informações. 
                O MediaHub reserva-se o direito de atualizar estes termos a qualquer momento, sendo responsabilidade do usuário acompanhar as alterações.`}
              />

              <SimpleModal
                triggerText="Política de Privacidade"
                title="Política de Privacidade"
                content={`O MediaHub valoriza sua privacidade. Coletamos apenas informações necessárias para fornecer nossos serviços, como cadastro de conta e preferências de uso. 
                Não compartilhamos dados pessoais com terceiros sem consentimento explícito. 
                Os dados coletados são utilizados para melhorar sua experiência e para comunicação sobre novidades e serviços.`}
              />

              <SimpleModal
                triggerText="Cookies"
                title="Cookies"
                content={`O MediaHub utiliza cookies para melhorar a experiência do usuário, lembrar preferências e analisar o uso da plataforma. 
                Cookies são pequenos arquivos armazenados em seu dispositivo e podem ser gerenciados ou desativados nas configurações do seu navegador. 
                O uso contínuo da plataforma implica aceitação do uso de cookies conforme descrito nesta política.`}
              />

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}