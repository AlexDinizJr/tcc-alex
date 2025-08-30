import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { mockLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = mockLogin({ email, password });
      
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Entrar</h2>
          
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-300 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm font-bold mb-2">Usuários de Teste:</p>
            <div className="text-gray-400 text-xs space-y-1">
              <p>Email: usuario@email.com | Senha: 123456</p>
              <p>Email: teste@email.com | Senha: senha123</p>
            </div>
          </div>

          <p className="text-gray-400 text-sm text-center mt-4">
            Não tem conta?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
  );
}