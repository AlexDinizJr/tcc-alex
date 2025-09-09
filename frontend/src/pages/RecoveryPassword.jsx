import { useState } from "react";
import { Link } from "react-router-dom";
import AuthContainer from "../components/auth/AuthContainer";

export default function RecoveryPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem!");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setMessage("Senha redefinida com sucesso! Agora você já pode fazer login.");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    }, 1500);
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
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9.23-3.888-10.95-8 1.73-4.112 6.01-8 10.95-8 1.659 0 3.24.417 4.63 1.15m1.525 1.75a9.985 9.985 0 013.18 4.1M1 1l22 22"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M1.05 12C2.78 16.11 7.08 20 12 20s9.22-3.89 10.95-8c-1.73-4.11-6.03-8-10.95-8S2.78 7.89 1.05 12z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
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
