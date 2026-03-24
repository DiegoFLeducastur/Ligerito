import { useState, useEffect } from 'react';

// Datos iniciales fuera para que sea más limpio
const inicialMochilas = JSON.parse(localStorage.getItem('ligerito_listas')) ?? [
  { id: '1', nombre: "Mochila Base", objetos: [], publica: false }
];
const inicialArmario = JSON.parse(localStorage.getItem('ligerito_armario')) ?? [];

export const useMochilas = () => {
  const [listas, setListas] = useState(inicialMochilas);
  const [inventarioGeneral, setInventarioGeneral] = useState(inicialArmario);
  const [idListaActiva, setIdListaActiva] = useState(listas[0]?.id || '1');

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem('ligerito_listas', JSON.stringify(listas));
  }, [listas]);

  useEffect(() => {
    localStorage.setItem('ligerito_armario', JSON.stringify(inventarioGeneral));
  }, [inventarioGeneral]);

  const mochilaActiva = listas.find(l => l.id === idListaActiva) || listas[0];

  // --- FUNCIONES DE LÓGICA ---

  const crearNuevaLista = (nombre) => {
    const nueva = { id: Date.now().toString(), nombre, objetos: [], publica: false };
    setListas([...listas, nueva]);
    setIdListaActiva(nueva.id);
  };

  const borrarLista = (id) => {
    if (listas.length === 1) return;
    const filtradas = listas.filter(l => l.id !== id);
    setListas(filtradas);
    if (id === idListaActiva) setIdListaActiva(filtradas[0].id);
  };

  const actualizarNombreLista = (nuevoNombre) => {
    setListas(listas.map(l => l.id === idListaActiva ? { ...l, nombre: nuevoNombre } : l));
  };

  const togglePublica = () => {
    setListas(listas.map(l => l.id === idListaActiva ? { ...l, publica: !l.publica } : l));
  };

  // Función estrella: No duplica y suma cantidad
  const manejarNuevoItem = (datos) => {
    setListas(listas.map(l => {
      if (l.id === idListaActiva) {
        const existe = l.objetos.some(obj => obj.nombre.toLowerCase() === datos.nombre.toLowerCase());

        if (existe) {
          return {
            ...l,
            objetos: l.objetos.map(obj => 
              obj.nombre.toLowerCase() === datos.nombre.toLowerCase()
                ? { ...obj, cant: obj.cant + 1 }
                : obj
            )
          };
        } else {
          const nuevo = { ...datos, id: Date.now(), cant: 1 };
          return { ...l, objetos: [...l.objetos, nuevo] };
        }
      }
      return l;
    }));

    // Actualizar Armario Maestro
    if (!inventarioGeneral.some(i => i.nombre.toLowerCase() === datos.nombre.toLowerCase())) {
      setInventarioGeneral([...inventarioGeneral, { ...datos, id: Date.now() }]);
    }
  };

  const cambiarCantidad = (id, incremento) => {
    setListas(listas.map(l => {
      if (l.id === idListaActiva) {
        const nuevos = l.objetos.map(o => o.id === id ? { ...o, cant: o.cant + incremento } : o).filter(o => o.cant > 0);
        return { ...l, objetos: nuevos };
      }
      return l;
    }));
  };

  const eliminarObjeto = (id) => {
    setListas(listas.map(l => l.id === idListaActiva ? { ...l, objetos: l.objetos.filter(o => o.id !== id) } : l));
  };

  return {
    listas,
    mochilaActiva,
    idListaActiva,
    setIdListaActiva,
    inventarioGeneral,
    crearNuevaLista,
    borrarLista,
    actualizarNombreLista,
    togglePublica,
    manejarNuevoItem,
    cambiarCantidad,
    eliminarObjeto
  };
};