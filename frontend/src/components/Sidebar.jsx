import React, { useState } from "react";

export default function Sidebar({
  listas = [],
  idListaActiva,
  onSeleccionarLista,
  onCrearLista,
  onBorrarLista,
  inventario = [],
  onAñadirAlInventario,
  onEliminarDelInventario,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrandoInput, setMostrandoInput] = useState(false);
  const [nombreNueva, setNombreNueva] = useState("");
  const [itemAbierto, setItemAbierto] = useState(null);

  const filtrados = inventario.filter((i) =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <aside
      className="w-84 bg-slate-800 text-white h-screen flex flex-col shrink-0 shadow-2xl overflow-hidden border-r border-slate-700/50"
      role="complementary"
    >
      <div className="p-5 pb-3 flex items-center gap-3">
        <div className="bg-white/10 p-1.5 rounded-lg text-white" aria-hidden="true">
          <span className="material-symbols-outlined text-xl">scale</span>
        </div>
        <h1 className="text-xl font-black tracking-tighter">Ligerito.</h1>
      </div>

      <div className="px-5 mb-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Mis Listas
          </h2>
          <button
            onClick={() => setMostrandoInput(!mostrandoInput)}
            className="cursor-pointer text-slate-400 hover:text-white"
            aria-label="Nueva mochila"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
          </button>
        </div>

        {mostrandoInput && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (nombreNueva.trim()) {
                onCrearLista(nombreNueva);
                setNombreNueva("");
                setMostrandoInput(false);
              }
            }}
            className="mb-3 flex gap-2"
          >
            <input
              autoFocus
              aria-label="Nombre nueva lista"
              className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-3 py-1 text-xs text-white outline-none"
              placeholder="Nombre..."
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
            />
          </form>
        )}

        <nav className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {listas.map((l) => (
            <div
              key={l.id}
              onClick={() => onSeleccionarLista(l.id)}
              className={`flex items-center justify-between text-xs p-2 px-4 rounded-xl cursor-pointer transition-all ${
                l.id === idListaActiva
                  ? "bg-blue-500/10 text-blue-400 font-bold ring-1 ring-blue-500/30"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="truncate">{l.nombre}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBorrarLista(l.id);
                }}
                className="text-slate-500 hover:text-red-400"
                aria-label="Borrar"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </nav>
      </div>

      <div className="h-px bg-slate-700/50 mx-6 mb-4"></div>

      <div className="px-5 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Mi Armario
          </h2>
          <span className="text-[9px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase">
            {filtrados.length} Items
          </span>
        </div>

        <div className="relative mb-3 px-1">
          <span
            className="material-symbols-outlined absolute left-4 top-2 text-slate-500 text-lg"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="text"
            aria-label="Buscar ítem"
            placeholder="Buscar ítems..."
            className="w-full pl-9 pr-4 py-2 bg-slate-700/40 rounded-xl text-xs text-white outline-none border border-transparent focus:border-slate-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1 pb-6 -mx-1">
          {filtrados.map((obj) => {
            const mochilaActual = listas.find((l) => l.id === idListaActiva);
            const categoriasDisponibles = mochilaActual?.categorias || [];

            return (
              <div
                key={obj.id}
                className="flex flex-col p-2 px-3 rounded-xl bg-white/5 border border-white/5 group gap-2 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between leading-tight">
                      <span className="text-[13px] font-bold text-slate-100 truncate">
                        {obj.nombre}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-md border border-blue-400/20">
                        {obj.peso}g
                      </span>
                    </div>
                    {obj.descripcion && (
                      <p className="text-[11px] text-slate-400 italic truncate leading-none mt-0.5">
                        {obj.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Acciones (borrar + abrir menú) */}
                  <div className="flex items-center gap-1">
                    {/* BORRAR DEL ARMARIO */}
                    <button
                      onClick={() => {
                        const ok = confirm(
                          `¿Eliminar "${obj.nombre}" del armario?\nSe borrará también de todas las listas.`
                        );
                        if (!ok) return;
                        onEliminarDelInventario?.(obj.id);
                        if (itemAbierto === obj.id) setItemAbierto(null);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-red-400 cursor-pointer"
                      aria-label="Eliminar del armario"
                      title="Eliminar del armario"
                    >
                      <span className="material-symbols-outlined text-2xl font-light">
                        delete
                      </span>
                    </button>

                    {/* ABRIR/CERRAR MENÚ DE CATEGORÍAS */}
                    <button
                      onClick={() =>
                        setItemAbierto(itemAbierto === obj.id ? null : obj.id)
                      }
                      className={`transition-colors cursor-pointer ${
                        itemAbierto === obj.id
                          ? "text-blue-400"
                          : "text-slate-400 hover:text-blue-400"
                      }`}
                      aria-label="Añadir a categoría"
                      title="Añadir a categoría"
                    >
                      <span className="material-symbols-outlined text-2xl font-light">
                        {itemAbierto === obj.id ? "cancel" : "add_circle"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* MINI MENÚ DE SELECCIÓN DE CATEGORÍA */}
                {itemAbierto === obj.id && (
                  <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-700 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    <p className="text-[9px] uppercase font-bold text-slate-500 px-1 mb-1">
                      Selecciona Categoría:
                    </p>

                    {categoriasDisponibles.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1">
                        {categoriasDisponibles.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              onAñadirAlInventario({ ...obj, categoria: cat });
                              setItemAbierto(null);
                            }}
                            className="text-[10px] text-left px-2 py-1.5 hover:bg-blue-600 hover:text-white rounded bg-slate-800 transition-colors font-medium"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[9px] text-orange-400 italic p-1 text-center">
                        No hay categorías en esta mochila
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}