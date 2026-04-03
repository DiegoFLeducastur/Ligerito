import React from 'react';

export default function DetalleComunidad({ mochila, onVolver }) {
  // Seguridad por si la mochila no carga correctamente
  if (!mochila) return (
    <div className="p-10 text-center">
      <button onClick={onVolver} className="text-blue-500 font-bold">← Volver a Explorar</button>
      <p className="mt-4 text-slate-400">No se han encontrado detalles de esta mochila.</p>
    </div>
  );

  // Cálculo rápido del peso para la cabecera
  const pesoTotalGramos = mochila.detalleObjetos?.reduce((acc, obj) => acc + obj.peso, 0) || 0;
  const pesoTotalKg = (pesoTotalGramos / 1000).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header Superior */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onVolver} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{mochila.titulo}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Autor: {mochila.autor}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-blue-600">{pesoTotalKg} <span className="text-sm text-slate-400">KG</span></div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Peso de Referencia</p>
        </div>
      </header>

      {/* Listado de ítems de la comunidad */}
      <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Artículos en esta lista</h3>
          <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold">{mochila.items} ITEMS</span>
        </div>

        <div className="grid gap-3">
          {mochila.detalleObjetos?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <span className="text-sm font-bold text-slate-700">{item.nombre}</span>
                <p className="text-[10px] text-slate-400 italic">Dato de comunidad</p>
              </div>
              <span className="font-mono text-sm text-blue-500 bg-blue-50 px-3 py-1 rounded-lg font-bold">
                {item.peso} g
              </span>
            </div>
          ))}
        </div>

        <footer className="py-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[11px] italic shadow-sm">
            <span className="material-symbols-outlined text-sm">info</span>
            Estás en modo consulta. Compara estos pesos con tus propios objetos.
          </div>
        </footer>
      </main>
    </div>
  );
}