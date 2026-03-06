import React from 'react';

export default function Header() {
  return (
    <header className="h-17 bg-white backdrop-blur-sm border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
      {/* Título del viaje seleccionado */}
      <div>
        <h2 className="text-sm font-bold text-slate-900">
          Japan Autumn 2024
        </h2>
      </div>

      {/* Acciones y Perfil */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">share</span>
        </button>
        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
          <span className="material-symbols-outlined">settings</span>
        </button>
        
        {/* Avatar de usuario */}
        <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-100 ml-2 shadow-sm">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src="https://ui-avatars.com/api/?name=Diego+User&background=0D8ABC&color=fff" 
          />
        </div>
      </div>
    </header>
  );
}