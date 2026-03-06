import React, { useState } from 'react';

export default function ListaCategorias({ listaDeObjetos, onCambiarCantidad, onEliminar, onNuevoItem }) {
  const [catEditando, setCatEditando] = useState(null);
  const [nuevoItem, setNuevoItem] = useState({ nombre: '', desc: '', peso: '' });

  const categorias = ["Ropa", "Electrónica"];

  const manejarGuardar = (cat) => {
    if (!nuevoItem.nombre || !nuevoItem.peso) return;
    onNuevoItem({
      nombre: nuevoItem.nombre,
      peso: parseInt(nuevoItem.peso),
      desc: nuevoItem.desc,
      categoria: cat
    });
    setNuevoItem({ nombre: '', desc: '', peso: '' });
    setCatEditando(null);
  };

  return (
    <div className="space-y-10 pb-10">
      {categorias.map(cat => {
        const objetosCat = listaDeObjetos.filter(obj => obj.categoria === cat);
        const pesoTotalCat = objetosCat.reduce((acc, obj) => acc + (obj.peso * obj.cant), 0);
        const cantTotalCat = objetosCat.reduce((acc, obj) => acc + obj.cant, 0);

        return (
          <div key={cat} className="w-full">
            {/* --- CABECERA --- */}
            <div className="flex items-center justify-between mb-2 px-4">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-gray-700 text-lg leading-none">{cat}</h4>

                {catEditando !== cat && (
                  <button
                    onClick={() => setCatEditando(cat)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group uppercase tracking-wider leading-none"
                  >
                    <span className="material-symbols-outlined !text-xl transition-transform group-hover:scale-110">
                      add_circle
                    </span>
                    <span>Añadir</span>
                  </button>
                )}
              </div>

              <div className="flex items-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <span className="w-24 text-right">Peso</span>
                <span className="w-32 text-center">Cantidad</span>
                <div className="w-6"></div>
              </div>
            </div>

            <div className="bg-white border-y border-gray-200 shadow-sm overflow-hidden">
              {/* --- FILAS DE DATOS --- */}
              {objetosCat.map(item => (
                <div key={item.id} className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-slate-50 group transition-colors">
                  <div className="flex-1 flex items-baseline gap-3 min-w-0">
                    <p className="text-sm text-gray-700 font-semibold truncate">{item.nombre}</p>
                    {item.desc && <p className="text-[11px] text-gray-400 italic truncate border-l border-gray-200 pl-3">{item.desc}</p>}
                  </div>

                  <div className="w-24 text-right text-sm text-gray-500 font-mono">
                    {item.peso} g
                  </div>

                  <div className="w-32 flex justify-center items-center gap-3 text-gray-400">
                    <button
                      onClick={() => onCambiarCantidad(item.id, -1)}
                      className="hover:text-blue-500 transition-colors text-lg cursor-pointer px-1"
                    >-</button>
                    <span className="text-sm font-bold w-4 text-center text-gray-700">{item.cant}</span>
                    <button
                      onClick={() => onCambiarCantidad(item.id, 1)}
                      className="hover:text-blue-500 transition-colors text-lg cursor-pointer px-1"
                    >+</button>
                  </div>

                  <div className="w-6 flex justify-end">
                    <button
                      onClick={() => onEliminar(item.id)}
                      className="text-gray-200 hover:text-red-500 transition-colors text-xl leading-none cursor-pointer"
                    >&times;</button>
                  </div>
                </div>
              ))}

              {/* --- FILA DE FORMULARIO --- */}
              {catEditando === cat && (
                <div className="flex items-center px-4 py-2 bg-blue-50/20 gap-4 border-b border-blue-100">
                  <div className="flex-1 flex gap-2">
                    <input
                      autoFocus
                      placeholder="Nombre del ítem"
                      className="flex-1 p-1 text-sm border-b border-gray-300 bg-transparent outline-none focus:border-blue-500 transition-colors"
                      value={nuevoItem.nombre}
                      onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
                    />
                    <input
                      placeholder="Descripción (opcional)"
                      className="flex-1 p-1 text-[11px] border-b border-gray-300 bg-transparent outline-none focus:border-blue-500 italic transition-colors"
                      value={nuevoItem.desc}
                      onChange={(e) => setNuevoItem({ ...nuevoItem, desc: e.target.value })}
                    />
                  </div>

                  <div className="w-24 flex items-center border-b border-gray-300 focus-within:border-blue-500 transition-colors">
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full p-1 text-sm bg-transparent outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={nuevoItem.peso}
                      onChange={(e) => setNuevoItem({ ...nuevoItem, peso: e.target.value })}
                    />
                    <span className="text-[10px] text-gray-400 ml-1">g</span>
                  </div>

                  <div className="w-32 flex justify-center gap-4">
                    <button
                      onClick={() => manejarGuardar(cat)}
                      className="text-green-600 hover:text-green-700 transition-colors cursor-pointer flex items-center"
                      title="Guardar"
                    >
                      <span className="material-symbols-outlined !text-2xl">check_circle</span>
                    </button>
                    <button
                      onClick={() => setCatEditando(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex items-center"
                      title="Cancelar"
                    >
                      <span className="material-symbols-outlined !text-2xl">cancel</span>
                    </button>
                  </div>
                  <div className="w-6"></div>
                </div>
              )}
            </div>

            {/* --- FILA DE TOTALES --- */}
            <div className="flex items-center px-4 py-3 bg-white border-b border-gray-100">
              <div className="flex-1 text-[11px] text-gray-400 font-medium italic">
                {/* Mantenemos el contador para rellenar el espacio flex */}
                {objetosCat.length === 0 ? "Categoría vacía" : `${objetosCat.length} artículos`}
              </div>
              <div className="w-24 text-right font-bold text-gray-800 text-sm">
                {pesoTotalCat} g
              </div>
              <div className="w-32 text-center font-bold text-gray-800 text-sm pr-2">
                {cantTotalCat}
              </div>
              <div className="w-6"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}