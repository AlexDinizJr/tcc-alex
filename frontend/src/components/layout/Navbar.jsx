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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold hover:text-blue-400 transition-colors flex items-center gap-2">
              <span className="bg-blue-600 p-1 rounded">
                🎬
              </span>
              RecommendationHub
            </Link>

            {/* Menu Mobile Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            <AuthSection 
              user={user} 
              isAuthenticated={isAuthenticated} 
              onLogout={handleLogout} 
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
            <div className="mb-4">
              <SearchBar />
            </div>
            <div className="space-y-3">
              <NavLinks mobile />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <AuthSection 
                user={user} 
                isAuthenticated={isAuthenticated} 
                onLogout={handleLogout} 
                mobile 
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}