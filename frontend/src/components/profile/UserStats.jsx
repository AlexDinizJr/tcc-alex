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
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-400/30",
      textColor: "text-blue-300",
      textLabelColor: "text-blue-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    },
    {
      key: "showReviews",
      label: "Avaliações",
      value: stats.reviews,
      show: privacy?.showReviews !== false,
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-400/30",
      textColor: "text-purple-300",
      textLabelColor: "text-purple-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      key: "showFavorites",
      label: "Favoritos",
      value: stats.favorites,
      show: privacy?.showFavorites !== false,
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-400/30",
      textColor: "text-yellow-300",
      textLabelColor: "text-yellow-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      key: "lists",
      label: "Listas criadas",
      value: stats.lists,
      show: true,
      bgColor: "bg-pink-500/20",
      borderColor: "border-pink-400/30",
      textColor: "text-pink-300",
      textLabelColor: "text-pink-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
  ];

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        {/* Ícone de estatísticas */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Minhas Estatísticas
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map(({ key, label, value, show, bgColor, borderColor, textColor, textLabelColor, icon }) => (
          <div
            key={key}
            className={`rounded-lg p-4 text-center border ${show ? `${bgColor} ${borderColor}` : "bg-gray-700/30 border-gray-600/30"}`}
          >
            <div className="flex justify-center mb-2">
              <div className={`p-2 rounded-full ${show ? bgColor : "bg-gray-600/30"}`}>
                <div className={show ? textColor : "text-gray-500"}>
                  {icon}
                </div>
              </div>
            </div>
            <div className={`text-2xl font-bold ${show ? textColor : "text-gray-500"}`}>
              {show ? value : "---"}
            </div>
            <div className={`text-sm mt-1 ${show ? textLabelColor : "text-gray-500"}`}>
              {label}
            </div>
            {!show && (
              <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                {/* Ícone de privado */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privado
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}