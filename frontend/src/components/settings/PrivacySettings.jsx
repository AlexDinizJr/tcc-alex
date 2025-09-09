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
      <h1 className="text-2xl font-bold text-white mb-6">
        Configurações de Privacidade
      </h1>

      {/* Visibilidade do Perfil */}
      <div className="bg-gray-800/80 rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Visibilidade do Perfil
        </h3>

        <div className="space-y-3">
          {["public", "private"].map((value) => (
            <label
              key={value}
              className="flex items-center gap-3 p-3 border border-gray-700/50 rounded-lg hover:bg-gray-700 cursor-pointer"
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
                className="text-blue-500 focus:ring-blue-400"
              />
              <div>
                <p className="font-medium text-white">
                  {value === "public" ? "Público" : "Privado"}
                </p>
                <p className="text-gray-300 text-sm">
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
      <div className="bg-gray-800/80 rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Controle de Conteúdo
        </h3>

        {privacySettings.profileVisibility === "private" && (
          <p className="text-red-500 text-sm mb-4">
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
                  <p className="font-medium text-white">{label}</p>
                  <p className="text-gray-300 text-sm">{desc}</p>
                </div>
                <button
                  onClick={() => !disabled && handleToggle(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings[key] ? "bg-blue-500" : "bg-gray-600"
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
              {index < 3 && <hr className="border-gray-700/50 my-2" />}
            </div>
          );
        })}
      </div>

      {/* Dados e Analytics */}
      <div className="bg-gray-800/80 rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Coleta de Dados
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">
              Compartilhar dados para analytics
            </p>
            <p className="text-gray-300 text-sm">
              Ajudar a melhorar nossos serviços
            </p>
          </div>
          <button
            onClick={() => handleToggle("dataCollection")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              privacySettings.dataCollection ? "bg-blue-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacySettings.dataCollection ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="bg-gray-900/80 rounded-2xl p-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </div>
  );
}
