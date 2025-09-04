export default function UserStats({ user }) {
  // Calcular estatísticas reais do usuário
  const calculateStats = () => {
    return {
      savedItems: user?.savedMedia?.length || 0,
      reviews: user?.reviews?.length || 0,
      lists: user?.lists?.length || 0,
      activeDays: calculateActiveDays(user)
    };
  };

  const calculateActiveDays = (userData) => {
    // Lógica simples para calcular dias ativos
    // Você pode melhorar isso com dados reais de atividade
    if (!userData?.createdAt) return 1;
    
    const createdDate = new Date(userData.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.min(diffDays, 30); // Máximo de 30 dias para exemplo
  };

  const stats = calculateStats();
  const { privacy } = user || {};
  
  // Verificar configurações de privacidade
  const showSavedItems = privacy?.showSavedItems !== false;
  const showReviews = privacy?.showReviews !== false;
  const showActivity = privacy?.showActivity !== false;
  const isProfilePublic = privacy?.profileVisibility === 'public';

  // Se o perfil for privado, mostrar mensagem
  if (!isProfilePublic) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Minhas Estatísticas</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-gray-600">Suas estatísticas são privadas</p>
          <p className="text-sm text-gray-500 mt-2">
            Apenas você pode ver estas informações
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Minhas Estatísticas</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Itens Salvos */}
        <div className={`rounded-lg p-4 text-center ${
          showSavedItems ? 'bg-indigo-50' : 'bg-gray-100'
        }`}>
          <div className={`text-3xl font-bold ${
            showSavedItems ? 'text-indigo-700' : 'text-gray-400'
          }`}>
            {showSavedItems ? stats.savedItems : '---'}
          </div>
          <div className={`text-sm ${
            showSavedItems ? 'text-indigo-600' : 'text-gray-500'
          }`}>
            Itens salvos
          </div>
          {!showSavedItems && (
            <div className="text-xs text-gray-400 mt-1">Privado</div>
          )}
        </div>

        {/* Avaliações */}
        <div className={`rounded-lg p-4 text-center ${
          showReviews ? 'bg-purple-50' : 'bg-gray-100'
        }`}>
          <div className={`text-3xl font-bold ${
            showReviews ? 'text-purple-700' : 'text-gray-400'
          }`}>
            {showReviews ? stats.reviews : '---'}
          </div>
          <div className={`text-sm ${
            showReviews ? 'text-purple-600' : 'text-gray-500'
          }`}>
            Avaliações
          </div>
          {!showReviews && (
            <div className="text-xs text-gray-400 mt-1">Privado</div>
          )}
        </div>

        {/* Listas Criadas */}
        <div className="bg-pink-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-pink-700">{stats.lists}</div>
          <div className="text-sm text-pink-600">Listas criadas</div>
        </div>

        {/* Dias Ativo */}
        <div className={`rounded-lg p-4 text-center ${
          showActivity ? 'bg-green-50' : 'bg-gray-100'
        }`}>
          <div className={`text-3xl font-bold ${
            showActivity ? 'text-green-700' : 'text-gray-400'
          }`}>
            {showActivity ? stats.activeDays : '---'}
          </div>
          <div className={`text-sm ${
            showActivity ? 'text-green-600' : 'text-gray-500'
          }`}>
            Dias ativo
          </div>
          {!showActivity && (
            <div className="text-xs text-gray-400 mt-1">Privado</div>
          )}
        </div>
      </div>

      {/* Informações de privacidade */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <span className="mr-2">🌎</span>
          Perfil público - estatísticas visíveis para todos
        </div>
      </div>
    </div>
  );
}