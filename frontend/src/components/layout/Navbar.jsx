import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppNavigate } from "../../hooks/useAppNavigate";
import { FaPlayCircle } from "react-icons/fa";
import SearchBar from "./NavSearchBar";
import NavLinks from "./NavLinks";
import AuthSection from "./AuthSection";

export default function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { goHome } = useAppNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    goHome();
  };

  // Funções para links do usuário logado
  const getUserProfileLink = () => (user?.username ? `/users/${user.username}` : "#");
  const getUserListsLink = () => (user?.username ? `/users/${user.username}/lists` : "#");

  if (loading) {
    return (
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">Carregando...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Esquerda: Logo + SearchBar + Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xl font-bold hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <span className="text-blue-500"><FaPlayCircle size={24} /></span>
            MediaHub
          </Link>

          <SearchBar />

          <div className="hidden md:flex items-center gap-4">
            <NavLinks />
          </div>
        </div>

        {/* Direita: Auth */}
        <div className="hidden md:flex items-center">
          <AuthSection
            user={user}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            profileLink={getUserProfileLink()}
            listsLink={getUserListsLink()}
          />
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center ml-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Expandido */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700 flex flex-col gap-4">
          <SearchBar />
          <NavLinks mobile />
          <AuthSection
            user={user}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            mobile
            profileLink={getUserProfileLink()}
            listsLink={getUserListsLink()}
          />
        </div>
      )}
    </nav>
  );
}
