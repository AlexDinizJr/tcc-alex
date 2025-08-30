import { Link } from "react-router-dom";

const navItems = [
  { to: "/movies", label: "Filmes", icon: "🎥" },
  { to: "/tvseries", label: "Séries", icon: "📺" },
  { to: "/games", label: "Games", icon: "🎮" },
  { to: "/musics", label: "Músicas", icon: "🎵" },
  { to: "/books", label: "Livros", icon: "📚" }
];

export default function NavLinks({ mobile = false }) {
  if (mobile) {
    return (
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  );
}