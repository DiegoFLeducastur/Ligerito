import React from 'react';

export default function FilaItem({ 
  item, 
  esLectura = false, 
  onCambiarCantidad, 
  onEliminar, 
  onAbrirEnlace 
}) {
  return (
    <div className="flex items-center px-6 py-3 hover:bg-slate-50/50 group text-xs transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 truncate">{item.nombre}</span>
          {/* BOTÓN DE ENLACE */}
          {esLectura ? (
            item.enlace && (
              <a href={item.enlace} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-blue-500 transition-colors">
                <span className="material-symbols-outlined text-lg">link</span>
              </a>
            )
          ) : (
            <button 
              onClick={() => onAbrirEnlace(item)}
              className={`material-symbols-outlined text-lg cursor-pointer transition-colors ${
                item.enlace ? 'text-slate-800' : 'text-slate-200 hover:text-blue-500'
              }`}
            >
              link
            </button>
          )}
        </div>
        {item.desc && <p className="text-[10px] text-slate-400 italic truncate mt-0.5">{item.desc}</p>}
      </div>
      
      <div className="flex items-center gap-6">
        <span className="font-mono text-slate-400 w-12 text-right">{item.peso}g</span>
        
        {!esLectura && (
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button onClick={() => onCambiarCantidad(item.id, -1)} className="px-2 hover:text-blue-600 font-bold cursor-pointer">-</button>
              <span className="font-bold w-6 text-center text-[10px]">{item.cant}</span>
              <button onClick={() => onCambiarCantidad(item.id, 1)} className="px-2 hover:text-blue-600 font-bold cursor-pointer">+</button>
            </div>
            <button onClick={() => onEliminar(item.id)} className="text-slate-200 hover:text-red-500 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}