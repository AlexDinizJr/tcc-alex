import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import SettingsSidebar from "../../components/settings/SettingsSidebar";
import ProfileSettings from "../../components/settings/ProfileSettings";
import AccountSettings from "../../components/settings/AccountSettings";
import PrivacySettings from "../../components/settings/PrivacySettings";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-lg font-semibold text-gray-400">
          Você precisa estar logado para acessar as configurações.
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={user} />;
      case "account":
        return <AccountSettings user={user} />;
      case "privacy":
        return <PrivacySettings user={user} />;
      default:
        return <ProfileSettings user={user} />;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar */}
          <SettingsSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            className="bg-gray-800/80 border-r border-gray-700/50"
          />
          
          {/* Conteúdo */}
          <div className="flex-1 p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
