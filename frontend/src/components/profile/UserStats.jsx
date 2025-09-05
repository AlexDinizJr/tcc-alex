export default function UserStats({ user }) {
  const stats = {
    savedItems: user?.savedMedia?.length || 0,
    reviews: user?.reviews?.length || 0,
    lists: user?.lists?.length || 0,
    favorites: user?.favorites?.length || 0,
  };

  const { privacy } = user || {};

  const items = [
    {
      key: "showSavedItems",
      label: "Itens salvos",
      value: stats.savedItems,
      show: privacy?.showSavedItems !== false,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      textLabelColor: "text-indigo-600",
    },
    {
      key: "showReviews",
      label: "Avaliações",
      value: stats.reviews,
      show: privacy?.showReviews !== false,
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      textLabelColor: "text-purple-600",
    },
    {
      key: "showFavorites",
      label: "Favoritos",
      value: stats.favorites,
      show: privacy?.showFavorites !== false,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      textLabelColor: "text-yellow-600",
    },
    {
      key: "lists",
      label: "Listas criadas",
      value: stats.lists,
      show: true,
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      textLabelColor: "text-pink-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Minhas Estatísticas</h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map(({ key, label, value, show, bgColor, textColor, textLabelColor }) => (
          <div
            key={key}
            className={`rounded-lg p-4 text-center ${show ? bgColor : "bg-gray-100"}`}
          >
            <div className={`text-3xl font-bold ${show ? textColor : "text-gray-400"}`}>
              {show ? value : "---"}
            </div>
            <div className={`text-sm ${show ? textLabelColor : "text-gray-500"}`}>
              {label}
            </div>
            {!show && <div className="text-xs text-gray-400 mt-1">Privado</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
