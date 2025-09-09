import { useState } from "react";

export default function FilterSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-700/50 rounded-2xl overflow-hidden shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-800/80 text-white hover:shadow-white/20 transition-shadow"
      >
        <span className="font-medium">{title}</span>
        <span className="text-gray-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="p-4 bg-gray-800/80 text-gray-200">{children}</div>}
    </div>
  );
}
