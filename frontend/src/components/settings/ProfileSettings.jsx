import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export default function ProfileSettings({ user }) {
  const { updateProfile, uploadAvatarFile, uploadCoverFile, removeAvatar, removeCover } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
  });

  const [preview, setPreview] = useState({
    avatar: user.avatar || "",
    coverImage: user.coverImage || ""
  });

  useEffect(() => {
    setPreview({
      avatar: user.avatar,
      coverImage: user.coverImage
    });
  }, [user]);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileUpload = (key, file) => {
    if (!file) return;
    setFormData(prev => ({ ...prev, [key]: file }));

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(prev => ({ ...prev, [key]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = async (key) => {
    setIsLoading(true);
    try {
      if (key === "avatar") {
        await removeAvatar();
        setFormData(prev => ({ ...prev, avatar: null }));
        setPreview(prev => ({ ...prev, avatar: "" }));
      } else if (key === "coverImage") {
        await removeCover();
        setFormData(prev => ({ ...prev, coverImage: null }));
        setPreview(prev => ({ ...prev, coverImage: "" }));
      }
      showToast("Imagem removida com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showToast("Falha ao remover imagem", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Atualiza nome e bio
      await updateProfile({ name: formData.name, bio: formData.bio });

      // Upload avatar
      if (formData.avatar) {
        await uploadAvatarFile(formData.avatar);
      }

      // Upload cover
      if (formData.coverImage) {
        await uploadCoverFile(formData.coverImage);
      }

      showToast("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      console.error(error);
      showToast("Falha ao atualizar perfil", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Configurações de Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/80 p-6 rounded-2xl border border-gray-700/50">

        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Foto de Perfil</label>
          <div className="flex items-center gap-4">
            <img
              src={preview.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=007bff&color=fff`}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border border-gray-600"
            />
            <label className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600 text-sm">
              Carregar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload("avatar", e.target.files[0])}
              />
            </label>
            {preview.avatar && (
              <button
                type="button"
                onClick={() => handleRemove("avatar")}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 text-sm"
              >
                Remover
              </button>
            )}
          </div>
        </div>

        {/* Cover */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Foto de Capa</label>
          <div className="w-full h-40 bg-gray-700/30 rounded-lg overflow-hidden border border-gray-600 relative">
            {preview.coverImage ? (
              <img
                src={preview.coverImage}
                alt="Capa"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300">
                Sem capa
              </div>
            )}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <label className="bg-blue-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-blue-600 text-sm">
                Carregar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload("coverImage", e.target.files[0])}
                />
              </label>
              {preview.coverImage && (
                <button
                  type="button"
                  onClick={() => handleRemove("coverImage")}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 text-sm"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Nome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white bg-gray-800/90"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Biografia</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white bg-gray-800/90"
            placeholder="Conte um pouco sobre você..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}