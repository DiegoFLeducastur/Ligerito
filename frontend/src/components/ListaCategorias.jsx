import React, { useState } from "react";
import FilaItem from "./FilaItem";
import ModalEnlace from "./ModalEnlace";
import FormularioNuevoItem from "./FormularioNuevoItem";

export default function ListaCategorias({
  listaDeObjetos,
  categorias,
  onAñadirCategoria,
  onCambiarCantidad,
  onEliminar,
  onNuevoItem,
  onActualizarEnlace,
  onActualizarPeso,
  onActualizarDescripcion,
  onEliminarCategoria,
}) {
  const [catEditando, setCatEditando] = useState(null);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");
  const [mostrandoNuevaCat, setMostrandoNuevaCat] = useState(false);
  const [itemEditandoEnlace, setItemEditandoEnlace] = useState(null);

  return (
    <div className="space-y-4 pb-10">
      {categorias.map((cat) => {
        const objetosCat = listaDeObjetos.filter(
          (obj) => obj.categoria === cat,
        );
        const pesoTotalCat = objetosCat.reduce(
          (acc, obj) => acc + obj.peso * obj.cant,
          0,
        );

        return (
          <section
            key={cat}
            className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm"
          >
            {/* Header de Categoría */}
            <div className="bg-slate-50/50 px-6 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h4 className="font-black text-slate-700 text-[10px] uppercase tracking-[0.15em]">
                  {cat}
                </h4>

                <button
                  onClick={() =>
                    setCatEditando(cat === catEditando ? null : cat)
                  }
                  className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer flex"
                  title="Añadir item"
                  aria-label="Añadir item"
                >
                  <span className="material-symbols-outlined text-xl">
                    add_circle
                  </span>
                </button>

                <button
                  onClick={() => {
                    const ok = confirm(
                      `¿Eliminar la categoría "${cat}"?\nSe eliminarán también los items de esa categoría.`,
                    );
                    if (!ok) return;
                    onEliminarCategoria?.(cat);
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer flex"
                  title="Eliminar categoría"
                  aria-label="Eliminar categoría"
                >
                  <span className="material-symbols-outlined text-xl">
                    delete
                  </span>
                </button>
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
                {pesoTotalCat} G
              </span>
            </div>

            {/* Listado de Items usando FilaItem */}
            <div className="divide-y divide-slate-50">
              {objetosCat.map((item) => (
                <FilaItem
                  key={item.id}
                  item={item}
                  onCambiarCantidad={onCambiarCantidad}
                  onEliminar={onEliminar}
                  onAbrirEnlace={(it) => setItemEditandoEnlace(it)}
                  onActualizarPeso={onActualizarPeso}
                  onActualizarDescripcion={onActualizarDescripcion}
                />
              ))}

              {catEditando === cat && (
                <FormularioNuevoItem
                  categoria={cat}
                  onGuardar={onNuevoItem}
                  onCancelar={() => setCatEditando(null)}
                />
              )}
            </div>
          </section>
        );
      })}

      {/* Botón Añadir Categoría */}
      <div className="pt-2">
        {mostrandoNuevaCat ? (
          <div className="p-4 bg-white border-2 border-dashed border-blue-200 rounded-[1.5rem] animate-in zoom-in-95">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (nuevaCatNombre.trim()) {
                  onAñadirCategoria(nuevaCatNombre.trim());
                  setNuevaCatNombre("");
                  setMostrandoNuevaCat(false);
                }
              }}
              className="flex gap-3"
            >
              <input
                autoFocus
                className="flex-1 px-4 py-2 text-sm outline-none bg-slate-50 rounded-xl"
                placeholder="Nombre de la categoría..."
                value={nuevaCatNombre}
                onChange={(e) => setNuevaCatNombre(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100"
              >
                Añadir
              </button>
              <button
                type="button"
                onClick={() => setMostrandoNuevaCat(false)}
                className="text-slate-400 font-bold text-xs uppercase px-2 hover:text-slate-600"
              >
                Cancelar
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setMostrandoNuevaCat(true)}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-300">
              add_circle
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">
              Nueva Sección
            </span>
          </button>
        )}
      </div>

      {itemEditandoEnlace && (
        <ModalEnlace
          itemId={itemEditandoEnlace.id}
          enlaceInicial={itemEditandoEnlace.enlace}
          onGuardar={onActualizarEnlace}
          onCerrar={() => setItemEditandoEnlace(null)}
        />
      )}
    </div>
  );
}
