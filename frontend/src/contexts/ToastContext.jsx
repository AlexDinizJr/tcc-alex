import { createContext, useState } from 'react';
import { useToast } from "../hooks/useToast";

const ToastContext = createContext();

// Componente ToastProvider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  const value = {
    toasts,
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Componente ToastContainer
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Componente Toast
const Toast = ({ message, type, onClose }) => {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white border-green-700';
      case 'error':
        return 'bg-red-600 text-white border-red-700';
      case 'warning':
        return 'bg-yellow-500 text-gray-900 border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-600 text-white border-blue-700';
    }
  };

  return (
    <div
      className={`px-4 py-3 rounded-lg shadow-lg border-l-4 ${getToastStyles()} 
                 animate-fade-in transition-all duration-300 min-w-[250px] 
                 flex items-center justify-between`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-3 text-white hover:text-gray-200 transition-colors"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
};

export default ToastContext;