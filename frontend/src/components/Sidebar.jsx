import React, { useState } from 'react';

export default function Sidebar({ 
  listas = [], 
  idListaActiva, 
  onSeleccionarLista, 
  onCrearLista, 
  onBorrarLista,
  inventario = [], 
  onAñadirAlInventario 
}) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrandoInputNuevaLista, setMostrandoInputNuevaLista] = useState(false);
  const [nombreNuevaLista, setNombreNuevaLista] = useState("");

  const manejarCrear = (e) => {
    e.preventDefault();
    if (nombreNuevaLista.trim()) {
      onCrearLista(nombreNuevaLista.trim());
      setNombreNuevaLista("");
      setMostrandoInputNuevaLista(false);
    }
  };

  const filtrados = inventario.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <aside className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col shrink-0 shadow-sm">
      
      {/* --- 1. LOGO --- */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-slate-800 p-1.5 rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-xl font-light">scale</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          Ligerito<span className="text-blue-500">.</span>
        </h1>
      </div>

      {/* --- 2. SECCIÓN: MIS LISTAS --- */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mis Listas</h2>
          <button 
            onClick={() => setMostrandoInputNuevaLista(!mostrandoInputNuevaLista)} 
            className="cursor-pointer text-slate-400 hover:text-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
          </button>
        </div>

        {mostrandoInputNuevaLista && (
          <form onSubmit={manejarCrear} className="px-2 mb-3 flex items-center gap-2">
            <input
              autoFocus
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-slate-400 transition-all"
              placeholder="Nombre..."
              value={nombreNuevaLista}
              onChange={(e) => setNombreNuevaLista(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setMostrandoInputNuevaLista(false)}
            />
            <button type="submit" className="text-slate-500 hover:text-slate-800 cursor-pointer">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </button>
          </form>
        )}

        <nav className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar px-1">
          {listas.map((lista) => (
            <div 
              key={lista.id} 
              onClick={() => onSeleccionarLista(lista.id)}
              className={`flex items-center justify-between text-sm p-2 px-3 rounded-lg cursor-pointer transition-all ${
                lista.id === idListaActiva 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="truncate flex-1">{lista.nombre}</span>
              {/* BOTÓN BORRAR LISTA: Ahora es una X siempre visible */}
              <button 
                onClick={(e) => { e.stopPropagation(); onBorrarLista(lista.id); }} 
                className="text-slate-300 hover:text-red-400 transition-colors ml-2 flex items-center shrink-0"
                title="Borrar lista"
              >
                <span className="material-symbols-outlined text-lg font-light">close</span>
              </button>
            </div>
          ))}
        </nav>
      </div>

      <div className="h-px bg-slate-100 mx-6 mb-6"></div>

      {/* --- 3. SECCIÓN: MI ARMARIO (INVENTARIO) --- */}
      <div className="px-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mi Armario</h2>
          <span className="text-[10px] text-slate-400 italic font-medium">{filtrados.length} items</span>
        </div>
        
        {/* BUSCADOR */}
        <div className="relative mb-4 px-2">
          <span className="material-symbols-outlined absolute left-4 top-2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Filtrar armario..."
            className="w-full pl-8 pr-2 py-1.5 bg-transparent border-b border-slate-100 text-sm outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* LISTA DE OBJETOS DEL ARMARIO */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
          {filtrados.length > 0 ? (
            filtrados.map((obj) => (
              <div 
                key={obj.id} 
                className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 transition-all border border-transparent"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] text-slate-600 truncate font-medium">
                      {obj.nombre}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {obj.peso}g
                    </span>
                  </div>
                </div>

                {/* BOTÓN AÑADIR: Siempre visible en gris suave */}
                <button 
                  onClick={() => onAñadirAlInventario(obj)}
                  className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-200 rounded transition-all cursor-pointer shrink-0 flex items-center justify-center"
                  title="Añadir a la mochila"
                >
                  <span className="material-symbols-outlined text-lg font-light">add_circle</span>
                </button>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-slate-300 italic text-xs font-light">
              Sin resultados
            </div>
          )}
        </div>
      </div>

      <div className="h-8"></div>
    </aside>
  );
}