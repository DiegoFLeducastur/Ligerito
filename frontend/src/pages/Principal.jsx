import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ResumenPesos from './components/ResumenPesos';
import ListaCategorias from './components/ListaCategorias';

function App() {
  // --- CARGA INICIAL DE DATOS ---
  const cargarListas = () => {
    const guardado = localStorage.getItem("ligerito_listas");
    return guardado ? JSON.parse(guardado) : [{ id: '1', nombre: "Mochila Base", objetos: [] }];
  };

  const cargarInventario = () => {
    const guardado = localStorage.getItem("ligerito_armario");
    return guardado ? JSON.parse(guardado) : [];
  };

  // --- ESTADOS GLOBALES ---
  const [listas, setListas] = useState(cargarListas);
  const [idListaActiva, setIdListaActiva] = useState(listas[0]?.id || '1');
  const [inventarioGeneral, setInventarioGeneral] = useState(cargarInventario);

  // --- PERSISTENCIA AUTOMÁTICA ---
  useEffect(() => {
    localStorage.setItem("ligerito_listas", JSON.stringify(listas));
  }, [listas]);

  useEffect(() => {
    localStorage.setItem("ligerito_armario", JSON.stringify(inventarioGeneral));
  }, [inventarioGeneral]);

  // --- LÓGICA DE MOCHILAS ---
  const crearNuevaLista = (nombre) => {
    const nueva = { id: Date.now().toString(), nombre, objetos: [] };
    setListas([...listas, nueva]);
    setIdListaActiva(nueva.id);
  };

  const borrarLista = (id) => {
    if (listas.length === 1) return alert("Debes tener al menos una lista.");
    const filtradas = listas.filter(l => l.id !== id);
    setListas(filtradas);
    if (id === idListaActiva) setIdListaActiva(filtradas[0].id);
  };

  // --- LÓGICA DE OBJETOS ---
  const mochilaActiva = listas.find(l => l.id === idListaActiva) || listas[0];

  const manejarNuevoItem = (datos) => {
    const nuevoItem = { ...datos, id: Date.now(), cant: datos.cant || 1, desc: datos.desc || "" };

    // Añadir a la mochila activa
    setListas(listas.map(l => {
      if (l.id === idListaActiva) return { ...l, objetos: [...l.objetos, nuevoItem] };
      return l;
    }));

    // Añadir al armario si no existe
    if (!inventarioGeneral.some(i => i.nombre.toLowerCase() === datos.nombre.toLowerCase())) {
      const { cant, ...itemArmario } = nuevoItem;
      setInventarioGeneral([...inventarioGeneral, itemArmario]);
    }
  };

  const cambiarCantidad = (id, incremento) => {
    setListas(listas.map(l => {
      if (l.id === idListaActiva) {
        const nuevosObjetos = l.objetos.map(obj => 
          obj.id === id ? { ...obj, cant: obj.cant + incremento } : obj
        ).filter(obj => obj.cant > 0);
        return { ...l, objetos: nuevosObjetos };
      }
      return l;
    }));
  };

  const eliminarObjeto = (id) => {
    setListas(listas.map(l => {
      if (l.id === idListaActiva) return { ...l, objetos: l.objetos.filter(obj => obj.id !== id) };
      return l;
    }));
  };

  return (
    <div className="flex h-screen bg-[#D9E9CF] overflow-hidden text-slate-900 font-sans">
      <Sidebar 
        listas={listas}
        idListaActiva={idListaActiva}
        onSeleccionarLista={setIdListaActiva}
        onCrearLista={crearNuevaLista}
        onBorrarLista={borrarLista}
        inventario={inventarioGeneral} 
        onAñadirAlInventario={manejarNuevoItem} 
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header nombreMochila={mochilaActiva.nombre} />
        <main className="p-8 max-w-4xl mx-auto w-full">
          <ResumenPesos listaDeObjetos={mochilaActiva.objetos} />
          <ListaCategorias
            listaDeObjetos={mochilaActiva.objetos}
            onCambiarCantidad={cambiarCantidad}
            onEliminar={eliminarObjeto}
            onNuevoItem={manejarNuevoItem} 
          />
          <footer className="mt-10 py-6 border-t border-slate-300 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            © 2026 Ligerito - Control de peso para viajes
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;