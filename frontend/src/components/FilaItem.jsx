import React, { useEffect, useState } from "react";

export default function FilaItem({
  item,
  esLectura = false,
  onCambiarCantidad,
  onEliminar,
  onAbrirEnlace,
  onActualizarPeso,
  onActualizarDescripcion,
}) {
  const [draftPeso, setDraftPeso] = useState(String(item.peso ?? ""));
  const [draftDescripcion, setDraftDescripcion] = useState(item.descripcion ?? ""); 

  useEffect(() => {
    setDraftPeso(String(item.peso ?? ""));
  }, [item.peso]);

  useEffect(() => {
    setDraftDescripcion(item.descripcion ?? "");
  }, [item.descripcion]);

  const commitPeso = () => {
    if (esLectura) return;
    if (!onActualizarPeso) return;

    const n = Number(draftPeso);
    if (!Number.isFinite(n) || n < 0) {
      setDraftPeso(String(item.peso ?? ""));
      return;
    }
    onActualizarPeso(item.id, n);
  };

  const commitDescripcion = () => {
    if (esLectura) return;
    if (!onActualizarDescripcion) return;
    onActualizarDescripcion(item.id, draftDescripcion);
  };

  return (
    <div className="flex items-center px-6 py-3 hover:bg-slate-50/50 group text-xs transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 truncate">{item.nombre}</span>

          {/* BOTÓN DE ENLACE */}
          {esLectura ? (
            item.enlace ? (
              <a
                href={String(item.enlace).startsWith("http") ? item.enlace : `https://${item.enlace}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 hover:text-blue-500 transition-colors"
                aria-label="Abrir enlace"
                title="Abrir enlace"
              >
                <span className="material-symbols-outlined text-lg">link</span>
              </a>
            ) : (
              <span className="text-slate-200" aria-label="Sin enlace" title="Sin enlace">
                <span className="material-symbols-outlined text-lg">link</span>
              </span>
            )
          ) : (
            <button
              onClick={() => onAbrirEnlace?.(item)}
              className={`material-symbols-outlined text-lg cursor-pointer transition-colors ${item.enlace ? "text-slate-800" : "text-slate-200 hover:text-blue-500"
                }`}
              aria-label={item.enlace ? "Editar/Ver enlace" : "Añadir enlace"}
              title={item.enlace ? "Editar/Ver enlace" : "Añadir enlace"}
            >
              link
            </button>
          )}
        </div>

        {/* DESCRIPCIÓN */}
        {esLectura ? (
          item.descripcion && (
            <p className="text-[10px] text-slate-400 italic truncate mt-0.5">
              {item.descripcion}
            </p>
          )
        ) : (
          <input
            className="mt-0.5 w-full text-[10px] text-slate-500 italic bg-transparent outline-none border-b border-transparent focus:border-blue-300"
            placeholder="Añade una descripción..."
            value={draftDescripcion}
            onChange={(e) => setDraftDescripcion(e.target.value)}
            onBlur={commitDescripcion}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDescripcion();
                e.currentTarget.blur();
              }
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* PESO */}
        {esLectura ? (
          <span className="font-mono text-slate-400 w-12 text-right">
            {item.peso}g
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <input
              type="number"
              className="w-20 font-mono text-slate-600 text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400 text-right"
              value={draftPeso}
              onChange={(e) => setDraftPeso(e.target.value)}
              onBlur={commitPeso}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitPeso();
                  e.currentTarget.blur();
                }
              }}
              placeholder="0"
            />
            <span className="text-[10px] text-slate-400 font-bold">g</span>
          </div>
        )}

        {!esLectura && (
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => onCambiarCantidad(item.id, -1)}
                className="px-2 hover:text-blue-600 font-bold cursor-pointer"
              >
                -
              </button>
              <span className="font-bold w-6 text-center text-[10px]">
                {item.cant}
              </span>
              <button
                onClick={() => onCambiarCantidad(item.id, 1)}
                className="px-2 hover:text-blue-600 font-bold cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={() => onEliminar(item.id)}
              className="text-slate-200 hover:text-red-500 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}