import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
      };

      login(newUser);
      navigate("/preferences");
      
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Cadastrar</h2>
          
          {error && (
            <div className="bg-blue-600 text-white p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-300 mb-1">Nome</label>
              <input
                type="text"
                placeholder="Digite seu nome"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
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
                placeholder="Crie uma senha (mínimo 6 caracteres)"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Confirmar Senha</label>
              <input
                type="password"
                placeholder="Confirme sua senha"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Cadastrar"}
            </button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-4">
            Já tem conta?{" "}
            <Link 
              to="/login" 
              className="text-blue-400 hover:underline"
              onClick={(e) => loading && e.preventDefault()}
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
  );
}