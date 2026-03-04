import React from 'react';

// Añadimos 'onEliminar' a las props que recibe el componente
export default function ListaCategorias({ listaDeObjetos, onCambiarCantidad, onEliminar }) {

  const ropa = listaDeObjetos.filter(obj => obj.categoria === "Ropa");
  const electronica = listaDeObjetos.filter(obj => obj.categoria === "Electrónica");

  return (
    <div className="space-y-10 pb-10">

      {/* SECCIÓN: ROPA */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <h4 className="font-bold text-gray-700">Ropa</h4>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
          {ropa.map((item) => (
            <div key={item.id} className="flex items-center px-4 py-3 border-b border-gray-50 group">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{item.nombre}</p>
              </div>
              <div className="w-24 text-center text-sm text-gray-600">{item.peso}g</div>

              <div className="w-24 flex justify-center items-center gap-2">
                <button
                  onClick={() => onCambiarCantidad(item.id, -1)}
                  className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center">{item.cant}</span>
                <button
                  onClick={() => onCambiarCantidad(item.id, 1)}
                  className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* BOTÓN DE ELIMINAR (LA X) */}
              <div className="w-8 text-right">
                <button
                  onClick={() => onEliminar(item.id)}
                  className="text-gray-300 hover:text-red-600 cursor-pointer transition-colors text-xl leading-none px-2"
                  title="Eliminar"
                >
                  {/* Este es el símbolo de multiplicar, que queda perfecto como una X de cierre */}
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN: ELECTRÓNICA */}
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-3">
          <h4 className="font-bold text-gray-700">Electrónica</h4>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
          {electronica.map((item) => (
            <div key={item.id} className="flex items-center px-4 py-3 border-b border-gray-50 group">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{item.nombre}</p>
              </div>
              <div className="w-24 text-center text-sm text-gray-600">{item.peso}g</div>
              <div className="w-24 flex justify-center items-center gap-2">
                <button
                  onClick={() => onCambiarCantidad(item.id, -1)}
                  className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-bold w-4 text-center">{item.cant}</span>
                <button
                  onClick={() => onCambiarCantidad(item.id, 1)}
                  className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* BOTÓN DE ELIMINAR (LA X) */}
              <div className="w-8 text-right">
                <button
                  onClick={() => onEliminar(item.id)}
                  className="text-gray-300 hover:text-red-600 cursor-pointer transition-colors text-xl leading-none px-2"
                  title="Eliminar"
                >
                  {/* Este es el símbolo de multiplicar, que queda perfecto como una X de cierre */}
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTÓN PARA AÑADIR CATEGORÍA --- */}
      <div className="pt-4">
        <button 
          className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-xs uppercase hover:bg-gray-50 hover:border-gray-300 hover:text-gray-500 transition-all cursor-pointer"
          onClick={() => alert('Función para añadir categoría próximamente')}
        >
          + Añadir Nueva Categoría
        </button>
      </div>

    </div>
  );
}