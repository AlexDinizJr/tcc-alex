import { Link } from "react-router-dom";

export default function UserLists({ userLists }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Minhas Listas</h2>
        <Link to="/lists" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          Ver todas
        </Link>
      </div>
      
      {userLists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userLists.slice(0, 4).map((list) => (
            <div key={list.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{list.name}</h3> {/* Mudado de title para name */}
                  <p className="text-gray-500 text-sm mt-1">{list.items?.length || 0} itens</p> {/* Mudado de itemCount para items.length */}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${list.isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {list.isPublic ? 'Pública' : 'Privada'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2 truncate">{list.description}</p>
              <div className="flex items-center mt-3 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Criada em {new Date(list.createdAt).toLocaleDateString('pt-BR')} {/* Formatando a data */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">Você ainda não criou nenhuma lista.</p>
          <p className="text-gray-400 text-sm mt-1">Organize seus itens favoritos em listas temáticas!</p>
          <Link 
            to="/create-list" 
            className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Criar minha primeira lista
          </Link>
        </div>
      )}
    </div>
  );
}