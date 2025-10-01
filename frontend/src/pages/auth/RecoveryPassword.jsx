import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthContainer from "../../components/auth/AuthContainer";
import api from "../../services/api";

export default function RecoveryPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // pega token da URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Token ausente na URL.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/password/reset", {
        token,
        newPassword: password
      });

      setMessage(response.data.message);
      setPassword("");
      setConfirmPassword("");

      // redireciona após 2s
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (value, setValue, placeholder, show, setShow) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full p-4 pr-12 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        minLength={6}
        disabled={loading}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-300 focus:outline-none"
        onClick={() => setShow(!show)}
        disabled={loading}
      >
        {show ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );

  return (
    <AuthContainer
      title="Redefinir Senha"
      subtitle="Crie uma nova senha para sua conta"
      footer={
        <p className="text-gray-400 text-sm text-center">
          Lembrou sua senha?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors duration-200"
          >
            Fazer login
          </Link>
        </p>
      }
    >
      {message && (
        <div
          className={`p-3 rounded-lg mb-6 text-center text-sm font-medium border ${
            message.includes("sucesso")
              ? "bg-green-500/20 text-green-300 border-green-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          }`}
        >
          {message}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {renderInput(password, setPassword, "Nova senha", showPassword, setShowPassword)}
        {renderInput(confirmPassword, setConfirmPassword, "Confirme sua senha", showConfirmPassword, setShowConfirmPassword)}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg transition-all duration-300 hover:bg-blue-500 cursor-pointer disabled:opacity-50 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? "Redefinindo..." : "Redefinir Senha"}
        </button>
      </form>
    </AuthContainer>
  );
}
