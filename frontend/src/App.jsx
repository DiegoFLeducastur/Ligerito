import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ResumenPesos from './components/ResumenPesos';
import ListaCategorias from './components/ListaCategorias';

function App() {
  // 1. Estado con los objetos iniciales
  const [objetos, setObjetos] = useState([
    { id: 1, nombre: "Camiseta Merino", peso: 150, cant: 1, categoria: "Ropa" },
    { id: 2, nombre: "Chaqueta Plumas", peso: 280, cant: 1, categoria: "Ropa" },
    { id: 3, nombre: "Cámara Fotos", peso: 650, cant: 1, categoria: "Electrónica" }
  ]);

  // 2. Función para cambiar cantidad (+ o -)
  const cambiarCantidad = (id, incremento) => {
    const nuevaLista = objetos.map(obj => {
      if (obj.id === id) {
        return { ...obj, cant: obj.cant + incremento };
      }
      return obj;
    }).filter(obj => obj.cant > 0); // Borra automáticamente si llega a 0
    
    setObjetos(nuevaLista);
  };

  // 3. Función para eliminar directamente con la X
  const eliminarObjeto = (id) => {
    const listaFiltrada = objetos.filter(obj => obj.id !== id);
    setObjetos(listaFiltrada);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />

        <main className="p-8 max-w-4xl mx-auto w-full">
          {/* Pasamos los objetos al resumen para el cálculo de peso */}
          <ResumenPesos listaDeObjetos={objetos} />
          
          {/* Pasamos los objetos y las dos funciones de control */}
          <ListaCategorias
            listaDeObjetos={objetos}
            onCambiarCantidad={cambiarCantidad}
            onEliminar={eliminarObjeto}
          />

          <footer className="mt-10 py-6 border-t border-gray-200 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            © 2026 Ligerito - Control de peso para viajes
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;