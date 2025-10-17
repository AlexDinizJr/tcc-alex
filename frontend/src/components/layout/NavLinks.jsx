import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiFilm, 
  FiTv, 
  FiMusic, 
  FiBookOpen, 
  FiUser,
  FiClipboard,
  FiChevronDown, 
  FiChevronUp 
} from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";

const navItems = [
  { to: "/movies", label: "Filmes", icon: <FiFilm size={18} /> },
  { to: "/tvseries", label: "Séries", icon: <FiTv size={18} /> },
  { to: "/games", label: "Games", icon: <FaGamepad size={18} /> },
];

const dropdownItems = [
  { to: "/musics", label: "Músicas", icon: <FiMusic size={18} /> },
  { to: "/books", label: "Livros", icon: <FiBookOpen size={18} /> },
  { to: "/users", label: "Usuários", icon: <FiUser size={18} /> },
  { to: "/lists", label: "Listas", icon: <FiClipboard size={18} /> }
];

export default function NavLinks({ mobile = false }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (mobile) {
    const allItems = [...navItems, ...dropdownItems];
    return (
      <div className="space-y-2">
        {allItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    );
  }

  // desktop com dropdown
  return (
    <div className="flex items-center gap-1">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          {item.icon}
          {item.label}
        </Link>
      ))}

      {/* Dropdown desktop */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Mais
          {isDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full mt-1 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-40 flex flex-col z-50">
            {dropdownItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}