import { FaUser, FaCog, FaLock } from "react-icons/fa";

export default function SettingsSidebar({ activeTab, setActiveTab, className = "" }) {
  const menuItems = [
    { id: "profile", label: "Perfil", icon: <FaUser /> },
    { id: "account", label: "Conta", icon: <FaCog /> },
    { id: "privacy", label: "Privacidade", icon: <FaLock /> },
  ];

  return (
    <div className={`md:w-64 p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-200 mb-6">Configurações</h2>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === item.id
                ? "bg-blue-600 text-white font-medium"
                : "text-gray-300 hover:bg-gray-700"
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
