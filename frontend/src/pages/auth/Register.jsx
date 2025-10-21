import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import countries from 'world-countries';
import { useAuth } from "../../hooks/useAuth";
import AuthContainer from "../../components/auth/AuthContainer";
import SimpleModal from "../../components/SimpleModal";
import { Eye, EyeOff } from "lucide-react";

// Lista de países
const countryList = countries
  .map(country => country.translations.por?.common || country.name.common)
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, 'pt'));

// Opções de gênero
const genderOptions = [
  { value: "MALE", label: "Masculino" },
  { value: "FEMALE", label: "Feminino" },
  { value: "OTHER", label: "Outro" },
  { value: "NONE", label: "Prefiro não informar" }
];

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (!username.trim()) {
      setError("Username é obrigatório");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username só pode conter letras, números e underline");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Validação de idade (mínimo 13 anos)
    if (birthDate) {
      const age = calculateAge(birthDate);
      if (age < 13) {
        setError("Você deve ter pelo menos 13 anos para se cadastrar");
        return;
      }
      if (age > 120) {
        setError("Por favor, insira uma data de nascimento válida");
        return;
      }
    }

    // Validação de gênero
    if (gender && !["MALE", "FEMALE", "OTHER", "NONE"].includes(gender)) {
      setError("Selecione um gênero válido");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.toLowerCase().trim(),
        password,
        birthDate: birthDate || null,
        gender: gender || "NONE",
        location: location || null
      });

      if (result.success) {
        // Login automático após registro
        await login({ usernameOrEmail: email.toLowerCase().trim(), password });
        navigate("/preferences");
      } else {
        setError(result.error || "Erro ao criar conta. Tente novamente.");
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    setBirthDate(value);
    
    // Validação em tempo real da idade
    if (value) {
      const age = calculateAge(value);
      if (age < 13) {
        setError("Você deve ter pelo menos 13 anos para se cadastrar");
      } else if (age > 120) {
        setError("Por favor, insira uma data de nascimento válida");
      } else {
        setError("");
      }
    }
  };

  return (
    <AuthContainer title="Criar Conta" subtitle="Junte-se à nossa comunidade">
      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6 text-center text-sm font-medium border border-red-500/30">
          {error}
        </div>
      )}

      <p className="text-gray-400 text-sm mb-6 text-center">* Campos Obrigatórios</p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Nome */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Nome *
          </label>
          <input
            type="text"
            placeholder="Seu nome"
            className="w-full p-4 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Username *
          </label>
          <input
            type="text"
            placeholder="seuusername"
            className="w-full p-4 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            pattern="[a-zA-Z0-9_]+"
            title="Apenas letras, números e underline são permitidos"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Apenas letras, números e underline
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            E-mail *
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

        {/* Data de Nascimento */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Data de Nascimento
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full p-4 rounded-lg bg-gray-700/60 text-white placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200"
              value={birthDate}
              onChange={handleBirthDateChange}
              max={new Date().toISOString().split('T')[0]} // Não permite data futura
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {birthDate && calculateAge(birthDate) && `Idade: ${calculateAge(birthDate)} anos`}
          </p>
        </div>

        {/* Gênero */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Gênero
          </label>
          <select
            className="w-full p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecione seu gênero</option>
            {genderOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

      {/* Localização */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Localização
          </label>
          <div className="relative">
            <select
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
              border border-gray-600 transition-all duration-200"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            >
              <option value="">Selecione seu país</option>
              {countryList.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Senha *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-4 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirmar Senha */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Confirmar Senha *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              className="w-full p-4 rounded-lg bg-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200 pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>


      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Ao efetuar o cadastro, você reconhece e concorda com os {" "} 
          <SimpleModal
              triggerText="Termos de Uso"
              title="Termos de Uso"
              content={`Bem-vindo ao MediaHub! Ao utilizar nossa plataforma, você concorda com os termos e condições descritos aqui. 
          Estes termos regem o uso do site, serviços e conteúdos oferecidos, incluindo regras sobre acesso, comportamento dos usuários e responsabilidade pelo uso das informações. 
          O MediaHub reserva-se o direito de atualizar estes termos a qualquer momento, sendo responsabilidade do usuário acompanhar as alterações.`}
            />{" "}
          aplicáveis.
        </p>
      </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-4 rounded-lg transition-all duration-300 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Criando conta..." : "Cadastrar"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </AuthContainer>
  );
}