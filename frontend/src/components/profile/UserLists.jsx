import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function UserLists({ userLists, username }) {
  const { user: loggedInUser } = useAuth();
  const isOwner = loggedInUser?.username === username;

  return (
    <div className="bg-gray-800/80 rounded-2xl shadow-md p-6 border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {/* Ícone de listas */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Listas
        </h2>
        {userLists.length > 0 && (
          <Link 
            to={`/users/${username}/lists`} 
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Ver todas
            {/* Ícone de seta */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      
      {userLists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userLists.slice(0, 4).map((list) => {
            const canClick = isOwner || list.isPublic;
            const linkProps = canClick
              ? { to: `/users/${username}/lists/${list.id}` }
              : {};

            return canClick ? (
              <Link 
                key={list.id} 
                {...linkProps}
                className="block border border-gray-600/50 rounded-lg p-4 hover:shadow-white/10 transition hover:border-blue-400/50 bg-gray-700/50 group"
              >
                <ListCardContent list={list} />
              </Link>
            ) : (
              <div
                key={list.id}
                className="block border border-gray-600/50 rounded-lg p-4 bg-gray-700/30 text-gray-500 cursor-not-allowed"
              >
                <ListCardContent list={list} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-300">Este usuário ainda não criou nenhuma lista.</p>
          <p className="text-gray-400 text-sm mt-1">As listas aparecerão aqui quando forem criadas.</p>
        </div>
      )}
    </div>
  );
}

function ListCardContent({ list }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors">{list.name}</h3>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
            {/* Ícone de itens */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
            {list.items?.length || 0} itens
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${list.isPublic ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'}`}>
          {list.isPublic ? 'Pública' : 'Privada'}
        </span>
      </div>
      {list.description && (
        <p className="text-gray-300 text-sm mt-2 truncate flex items-start gap-1">
          {/* Ícone de descrição */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
          {list.description}
        </p>
      )}
      <div className="flex items-center mt-3 text-xs text-gray-400">
        {/* Ícone de calendário */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Criada em {new Date(list.createdAt).toLocaleDateString('pt-BR')}
      </div>
    </>
  );
}