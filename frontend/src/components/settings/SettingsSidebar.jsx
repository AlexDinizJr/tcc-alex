export default function SettingsSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "profile", label: "Perfil", icon: "👤" },
    { id: "account", label: "Conta", icon: "⚙️" },
    { id: "privacy", label: "Privacidade", icon: "🔒" }
  ];

  return (
    <div className="md:w-64 bg-gray-50 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Configurações</h2>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === item.id
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}