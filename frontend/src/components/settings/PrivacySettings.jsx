import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function PrivacySettings({ user }) {
  const { updateUser } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: user?.privacy?.profileVisibility || "public",
    showActivity: user?.privacy?.showActivity || true,
    allowMessages: user?.privacy?.allowMessages || true,
    showSavedItems: user?.privacy?.showSavedItems || false,
    showReviews: user?.privacy?.showReviews || true,
    dataCollection: user?.privacy?.dataCollection || true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = {
        ...user,
        privacy: privacySettings
      };
      await updateUser(updatedUser);
      // Sucesso
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações de Privacidade</h1>
      
      <div className="space-y-6">
        {/* Visibilidade do Perfil */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Visibilidade do Perfil</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={privacySettings.profileVisibility === "public"}
                onChange={(e) => handleChange("profileVisibility", e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">Público</p>
                <p className="text-sm text-gray-600">Qualquer pessoa pode ver seu perfil</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value="friends"
                checked={privacySettings.profileVisibility === "friends"}
                onChange={(e) => handleChange("profileVisibility", e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">Apenas Amigos</p>
                <p className="text-sm text-gray-600">Somente usuários que você aprovar</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={privacySettings.profileVisibility === "private"}
                onChange={(e) => handleChange("profileVisibility", e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">Privado</p>
                <p className="text-sm text-gray-600">Apenas você pode ver seu perfil</p>
              </div>
            </label>
          </div>
        </div>

        {/* Atividade e Conteúdo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Controle de Conteúdo</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Mostrar atividade recente</p>
                <p className="text-sm text-gray-600">Exibir suas atividades no feed</p>
              </div>
              <button
                onClick={() => handleToggle("showActivity")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.showActivity ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.showActivity ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Mostrar itens salvos</p>
                <p className="text-sm text-gray-600">Exibir sua lista de itens salvos publicamente</p>
              </div>
              <button
                onClick={() => handleToggle("showSavedItems")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.showSavedItems ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.showSavedItems ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Mostrar avaliações</p>
                <p className="text-sm text-gray-600">Exibir suas avaliações publicamente</p>
              </div>
              <button
                onClick={() => handleToggle("showReviews")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.showReviews ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.showReviews ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Comunicação */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Comunicação</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Permitir mensagens</p>
              <p className="text-sm text-gray-600">Receber mensagens de outros usuários</p>
            </div>
            <button
              onClick={() => handleToggle("allowMessages")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.allowMessages ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.allowMessages ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dados e Analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Coleta de Dados</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Compartilhar dados para analytics</p>
              <p className="text-sm text-gray-600">Ajudar a melhorar nossos serviços</p>
            </div>
            <button
              onClick={() => handleToggle("dataCollection")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.dataCollection ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.dataCollection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Suas configurações de privacidade</p>
              <p className="text-sm text-blue-600">Revise e salve suas preferências</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}