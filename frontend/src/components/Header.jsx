import React from "react";

export default function Header({
  nombreMochila,
  esPublica,
  onTogglePublica,
  onActualizarNombre,
  usuario,
  onLogout,
  onIrAExplorar,
  onExportarPDF,
  onIrAConfiguracion,
}) {
  return (
    <header className="h-16 bg-slate-50/50 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shrink-0 shadow-sm">
      <div className="flex flex-col min-w-0">
        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
          Mochila Seleccionada
        </div>
        <input
          type="text"
          aria-label="Editar nombre de mochila"
          value={nombreMochila}
          onChange={(e) => onActualizarNombre(e.target.value)}
          className="text-xl font-black text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0 w-full hover:bg-white/50 transition-colors rounded"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePublica}
          aria-label={esPublica ? "Hacer privada" : "Hacer pública"}
          className={`px-2 py-1 rounded-md border text-[9px] font-bold uppercase transition-all cursor-pointer ${esPublica ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" : "bg-white border-slate-300 text-slate-400"}`}
        >
          {esPublica ? "Pública" : "Privada"}
        </button>

        <div className="flex items-center bg-slate-200/50 rounded-lg p-0.5 border border-slate-200">
          <button
            onClick={onExportarPDF}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-md transition-all cursor-pointer"
            aria-label="Descargar PDF"
          >
            <span className="material-symbols-outlined text-xl">
              picture_as_pdf
            </span>
          </button>
          <button
            onClick={onIrAExplorar}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-all cursor-pointer"
            aria-label="Explorar comunidad"
          >
            <span className="material-symbols-outlined text-xl">explore</span>
          </button>
          <button
            onClick={onIrAConfiguracion}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-all cursor-pointer"
            aria-label="Configuración"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-300">
          <div className="text-right hidden sm:block leading-none">
            <p className="text-[12px] font-bold text-slate-800 mb-0.5">
              {usuario?.nick}
            </p>
            <button
              onClick={onLogout}
              className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
          <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-300 shadow-sm">
            <img
              alt="Perfil"
              className="w-full h-full object-cover"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nick ?? "")}&background=1e293b&color=fff`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
