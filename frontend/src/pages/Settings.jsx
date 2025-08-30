import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import ProfileSettings from "../components/settings/ProfileSettings";
import AccountSettings from "../components/settings/AccountSettings";
import PrivacySettings from "../components/settings/PrivacySettings";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Conteúdo */}
            <div className="flex-1 p-6 md:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}