import React from 'react';

export default function Explorar({ onVolver, onVerDetalle }) {
  const mochilasPublicas = [
    { 
      id: 101, autor: "Alex Walker", titulo: "Camino de Santiago", peso: "6.2", items: 24, cat: "Hiking",
      categorias: ["Ropa", "Refugio", "Cocina"],
      detalleObjetos: [
        { id: 1, nombre: "Mochila Osprey 45L", peso: 1200, cant: 1, categoria: "Refugio", enlace: "https://www.osprey.com" },
        { id: 2, nombre: "Saco plumas Ligerito", peso: 650, cant: 1, categoria: "Refugio" },
        { id: 3, nombre: "Hornillo Jetboil", peso: 400, cant: 1, categoria: "Cocina", enlace: "https://www.jetboil.com" }
      ]
    },
    { 
      id: 102, autor: "Elena Travel", titulo: "Sudeste Asiático", peso: "8.5", items: 42, cat: "Backpacking",
      categorias: ["Tecnología", "Ropa", "Higiene"],
      detalleObjetos: [
        { id: 4, nombre: "MacBook Air M2", peso: 1240, cant: 1, categoria: "Tecnología", enlace: "https://apple.com" },
        { id: 5, nombre: "Cámara Sony a6400", peso: 650, cant: 1, categoria: "Tecnología" },
        { id: 6, nombre: "Powerbank 20k", peso: 450, cant: 1, categoria: "Tecnología" }
      ]
    },
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Comunidad</h2>
          <p className="text-slate-500 mt-1 italic">Inspírate en las listas de otros viajeros y compara pesos.</p>
        </div>
        <button onClick={onVolver} className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-sm transition-all active:scale-95">
          Volver a mi mochila
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mochilasPublicas.map((m) => (
          <div key={m.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-default">
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-4 py-1.5 rounded-full">{m.cat}</span>
             <h3 className="text-2xl font-black text-slate-800 mt-6 group-hover:text-blue-600 transition-colors">{m.titulo}</h3>
             <p className="text-sm text-slate-400 mb-8">Lista compartida por <span className="font-bold text-slate-600">{m.autor}</span></p>
             <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                <div>
                  <div className="text-3xl font-black text-slate-800">{m.peso} <span className="text-sm text-slate-400">KG</span></div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Peso Base Sugerido</div>
                </div>
                <button 
                  onClick={() => onVerDetalle(m)} 
                  className="bg-slate-800 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-all font-bold text-sm cursor-pointer shadow-lg shadow-slate-200"
                >
                  Consultar Detalles
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}