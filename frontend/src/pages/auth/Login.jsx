import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

import AuthContainer from "../../components/auth/AuthContainer";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login({ usernameOrEmail: email, password });

      if (success) {
        navigate(from, { replace: true });
      } else {
        setError("E-mail ou senha inválidos.");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer title="Entrar" subtitle="Bem-vindo de volta!">
      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-center text-sm font-medium border border-red-500/30">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            E-mail
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full p-4 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              className="w-full p-4 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition z-index"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Botão de abrir modal */}
        <div className="text-right text-sm mt-1">
          <button
            type="button"
            className="text-blue-400 cursor-pointer hover:text-blue-300 hover:underline font-medium"
            onClick={() => setIsForgotModalOpen(true)}
          >
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Não tem conta?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </div>

      {/* Modal de recuperação */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </AuthContainer>
  );
}