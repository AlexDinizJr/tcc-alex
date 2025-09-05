import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileSettings({ user }) {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
    coverImage: user.coverImage || ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (key, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [key]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações de Perfil</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de Perfil
          </label>
          <div className="flex items-center gap-4">
            <img
              src={formData.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=007bff&color=fff`}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
            <label className="bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-700 text-sm">
              Carregar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload("avatar", e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Capa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de Capa
          </label>
          <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 relative">
            {formData.coverImage ? (
              <img
                src={formData.coverImage}
                alt="Capa"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Sem capa
              </div>
            )}
            <label className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-700 text-sm">
              Carregar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload("coverImage", e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biografia
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Conte um pouco sobre você..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
