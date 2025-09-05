import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function PrivacySettings({ user }) {
  const { updateUser } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: user?.privacy?.profileVisibility || "public",
    showSavedItems: user?.privacy?.showSavedItems ?? false,
    showFavorites: user?.privacy?.showFavorites ?? true,
    showReviews: user?.privacy?.showReviews ?? true,
    showStats: user?.privacy?.showStats ?? true,
    dataCollection: user?.privacy?.dataCollection ?? true
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
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Configurações de Privacidade
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Visibilidade do Perfil
        </h3>

        <div className="space-y-3">
          {["public", "private"].map((value) => (
            <label
              key={value}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="profileVisibility"
                value={value}
                checked={privacySettings.profileVisibility === value}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    profileVisibility: e.target.value
                  })
                }
                className="text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {value === "public" ? "Público" : "Privado"}
                </p>
                <p className="text-sm text-gray-600">
                  {value === "public"
                    ? "Qualquer pessoa pode ver seu perfil"
                    : "Apenas você pode ver seu perfil"}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

        {/* Controle de Conteúdo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Controle de Conteúdo
          </h3>

          {/* Mensagem explicativa se o perfil estiver privado */}
          {privacySettings.profileVisibility === "private" && (
            <p className="text-sm text-red-600 mb-4">
              Seu perfil está privado. Todos os itens de conteúdo ficarão invisíveis para outras pessoas.
            </p>
          )}

          {[
            {
              key: "showSavedItems",
              label: "Mostrar itens salvos",
              desc: "Exibir sua lista de itens salvos publicamente"
            },
            {
              key: "showFavorites",
              label: "Mostrar favoritos",
              desc: "Exibir suas mídias favoritas publicamente"
            },
            {
              key: "showReviews",
              label: "Mostrar avaliações",
              desc: "Exibir suas avaliações publicamente"
            },
            {
              key: "showStats",
              label: "Mostrar estatísticas",
              desc: "Exibir suas estatísticas publicamente"
            }
          ].map(({ key, label, desc }, index) => {
            const disabled = privacySettings.profileVisibility === "private";
            return (
              <div key={key}>
                <div className={`flex items-center justify-between py-3 ${disabled ? "opacity-50" : ""}`}>
                  <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                  <button
                    onClick={() => !disabled && handleToggle(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacySettings[key] ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    disabled={disabled}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings[key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {index < 3 && <hr className="border-gray-200 my-2" />}
              </div>
            );
          })}
        </div>

        {/* Dados e Analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Coleta de Dados
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                Compartilhar dados para analytics
              </p>
              <p className="text-sm text-gray-600">
                Ajudar a melhorar nossos serviços
              </p>
            </div>
            <button
              onClick={() => handleToggle("dataCollection")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacySettings.dataCollection ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacySettings.dataCollection
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">
                Suas configurações de privacidade
              </p>
              <p className="text-sm text-blue-600">
                Revise e salve suas preferências
              </p>
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
  );
}
