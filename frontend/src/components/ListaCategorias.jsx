import React, { useState } from 'react';
import FilaItem from './FilaItem';

export default function ListaCategorias({ 
  listaDeObjetos, 
  categorias, 
  onAñadirCategoria, 
  onCambiarCantidad, 
  onEliminar, 
  onNuevoItem,
  onActualizarEnlace, 
  onActualizarPeso, 
  onActualizarDescripcion
}) {
  const [catEditando, setCatEditando] = useState(null);
  const [nuevaCatNombre, setNuevaCatNombre] = useState("");
  const [mostrandoNuevaCat, setMostrandoNuevaCat] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({ nombre: '', descripcion: '', peso: '' });
  
  // ESTADOS PARA EL MODAL DE ENLACE
  const [itemEditandoEnlace, setItemEditandoEnlace] = useState(null);
  const [tempEnlace, setTempEnlace] = useState("");

  const manejarGuardarItem = (categoria) => {
    if (!nuevoItem.nombre || !nuevoItem.peso) return;
    onNuevoItem({
      nombre: nuevoItem.nombre,
      peso: parseInt(nuevoItem.peso),
      descripcion: nuevoItem.descripcion,
      categoria: categoria
    });
    setNuevoItem({ nombre: '', descripcion: '', peso: '' });
    setCatEditando(null);
  };

  const manejarKeyPress = (e, categoria) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      manejarGuardarItem(categoria);
    }
  };

  return (
    <div className="space-y-4 pb-10">
      {categorias.map(cat => {
        const objetosCat = listaDeObjetos.filter(obj => obj.categoria === cat);
        const pesoTotalCat = objetosCat.reduce((acc, obj) => acc + (obj.peso * obj.cant), 0);

        return (
          <section key={cat} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
            {/* Header de Categoría */}
            <div className="bg-slate-50/50 px-6 py-3 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h4 className="font-black text-slate-700 text-[10px] uppercase tracking-[0.15em]">{cat}</h4>
                <button 
                  onClick={() => setCatEditando(cat === catEditando ? null : cat)} 
                  className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer flex"
                >
                  <span className="material-symbols-outlined text-xl">add_circle</span>
                </button>
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">
                {pesoTotalCat} G
              </span>
            </div>

            {/* Listado de Items usando FilaItem */}
            <div className="divide-y divide-slate-50">
              {objetosCat.map(item => (
                <FilaItem 
                  key={item.id} 
                  item={item} 
                  onCambiarCantidad={onCambiarCantidad}
                  onEliminar={onEliminar}
                  onAbrirEnlace={(it) => {
                    setItemEditandoEnlace(it.id);
                    setTempEnlace(it.enlace || "");
                  }}
                  onActualizarPeso={onActualizarPeso}
                  onActualizarDescripcion={onActualizarDescripcion}
                />
              ))}
              
              {/* Formulario rápido para añadir ítem */}
              {catEditando === cat && (
                <div className="p-4 bg-blue-50/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex gap-2">
                    <input 
                      autoFocus placeholder="¿Qué añades?" 
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-400 shadow-sm" 
                      value={nuevoItem.nombre} 
                      onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
                      onKeyDown={(e) => manejarKeyPress(e, cat)} 
                    />
                    <input 
                      placeholder="Gramos" type="number" 
                      className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-400 shadow-sm" 
                      value={nuevoItem.peso} 
                      onChange={(e) => setNuevoItem({ ...nuevoItem, peso: e.target.value })}
                      onKeyDown={(e) => manejarKeyPress(e, cat)} 
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Descripción opcional..." 
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] italic outline-none focus:border-blue-400 shadow-sm" 
                      value={nuevoItem.descripcion} 
                      onChange={(e) => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })}
                      onKeyDown={(e) => manejarKeyPress(e, cat)} 
                    />
                    <button 
                      onClick={() => manejarGuardarItem(cat)} 
                      className="bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-100"
                    >
                      <span className="material-symbols-outlined text-sm">done</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Botón Añadir Categoría */}
      <div className="pt-2">
        {mostrandoNuevaCat ? (
          <div className="p-4 bg-white border-2 border-dashed border-blue-200 rounded-[1.5rem] animate-in zoom-in-95">
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              if (nuevaCatNombre.trim()) { 
                onAñadirCategoria(nuevaCatNombre.trim()); 
                setNuevaCatNombre(""); 
                setMostrandoNuevaCat(false); 
              } 
            }} className="flex gap-3">
              <input 
                autoFocus className="flex-1 px-4 py-2 text-sm outline-none bg-slate-50 rounded-xl" 
                placeholder="Nombre de la categoría..." 
                value={nuevaCatNombre} 
                onChange={(e) => setNuevaCatNombre(e.target.value)} 
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100">Añadir</button>
              <button type="button" onClick={() => setMostrandoNuevaCat(false)} className="text-slate-400 font-bold text-xs uppercase px-2 hover:text-slate-600">Cancelar</button>
            </form>
          </div>
        ) : (
          <button 
            onClick={() => setMostrandoNuevaCat(true)} 
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-300">add_circle</span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Nueva Sección</span>
          </button>
        )}
      </div>

      {/* MODAL DE GESTIÓN DE ENLACES */}
      {itemEditandoEnlace && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center relative border border-slate-100">
            <div className="bg-blue-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-blue-600 text-3xl">link</span>
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-2">Enlace de producto</h3>
            <p className="text-xs text-slate-400 mb-8 px-4 font-medium leading-relaxed">
              Pega la URL del artículo para consultarlo o comprarlo más tarde.
            </p>
            
            <input 
              autoFocus type="url" placeholder="https://..." value={tempEnlace} 
              onChange={(e) => setTempEnlace(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-blue-400 mb-6 bg-slate-50 transition-all focus:bg-white"
            />

            <div className="flex flex-col gap-3">
              {tempEnlace && tempEnlace.includes('.') && (
                <a 
                  href={tempEnlace.startsWith('http') ? tempEnlace : `https://${tempEnlace}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span> Visitar Tienda
                </a>
              )}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setItemEditandoEnlace(null)} 
                  className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => { 
                    onActualizarEnlace(itemEditandoEnlace, tempEnlace); 
                    setItemEditandoEnlace(null); 
                  }}
                  className="flex-1 bg-slate-800 text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                  {tempEnlace ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}