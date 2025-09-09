export default function AuthContainer({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative z-10 bg-gray-800/80 p-8 rounded-2xl 
                      w-full max-w-md 
                      border border-gray-700/50 
                      shadow-md">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && <p className="text-gray-300 mt-2">{subtitle}</p>}
        </div>

        {/* Conteúdo */}
        <div>{children}</div>

        {/* Rodapé */}
        {footer && (
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
