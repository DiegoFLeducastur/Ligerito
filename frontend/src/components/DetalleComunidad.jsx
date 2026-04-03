import React from 'react';
import ResumenPesos from '../components/ResumenPesos';
import FilaItem from '../components/FilaItem'; // <--- Usamos el nuevo componente

export default function DetalleComunidad({ mochila, onVolver }) {
  if (!mochila) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
      <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onVolver} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{mochila.titulo}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest uppercase">Por {mochila.autor}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-blue-600">{mochila.peso} <span className="text-sm text-slate-400">KG</span></div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Referencia de Peso</p>
        </div>
      </header>

      <main className="p-8 max-w-4xl mx-auto w-full space-y-10">
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Distribución Compartida</h3>
          <ResumenPesos listaDeObjetos={mochila.detalleObjetos} categorias={mochila.categorias} />
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Listado de Equipamiento</h3>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{mochila.items} OBJETOS</span>
          </div>
          <div className="divide-y divide-slate-100">
            {mochila.detalleObjetos.map((item, idx) => (
              <FilaItem key={idx} item={item} esLectura={true} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}