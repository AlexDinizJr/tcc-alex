import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppNavigate } from "../../hooks/useAppNavigate";
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

  if (loading) {
    return (
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div>Carregando...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* Esquerda: Logo + SearchBar + Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold hover:text-blue-400 transition-colors flex items-center gap-1">
            <span className="bg-blue-600 p-1 rounded">🎬</span>
            RecommendationHub
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
          />
        </div>
      )}
    </nav>
  );
}
