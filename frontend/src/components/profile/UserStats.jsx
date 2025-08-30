export default function UserStats({ stats }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Minhas Estatísticas</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-indigo-700">{stats.savedItems}</div>
          <div className="text-sm text-indigo-600">Itens salvos</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-700">{stats.reviews}</div>
          <div className="text-sm text-purple-600">Avaliações</div>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-pink-700">{stats.lists}</div>
          <div className="text-sm text-pink-600">Listas criadas</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{stats.activeDays}</div>
          <div className="text-sm text-green-600">Dias ativo</div>
        </div>
      </div>
    </div>
  );
}