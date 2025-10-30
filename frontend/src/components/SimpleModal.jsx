import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

export default function SimpleModal({ title, content, triggerText }) {
  const [isOpen, setIsOpen] = useState(false);

  // Ativa o bloqueio de scroll quando o modal estiver aberto
  useLockBodyScroll(isOpen);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-400 hover:underline transition-colors cursor-pointer text-sm"
      >
        {triggerText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl animate-modalPop">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <AiOutlineClose className="w-6 h-6" />
              </button>
            </div>
            <div className="text-gray-300 text-justify text-sm">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}
