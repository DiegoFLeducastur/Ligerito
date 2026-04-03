import { useState, useEffect } from 'react';

//Datos iniciales fuera para que sea más limpio
const inicialMochilas = JSON.parse(localStorage.getItem('ligerito_listas')) ?? [
  { id: '1', nombre: "Mochila Base", objetos: [], categorias: ["Ropa", "Cocina"], publica: false }
];

const inicialArmario = JSON.parse(localStorage.getItem('ligerito_armario')) ?? [];

export const useMochilas = () => {
  const [listas, setListas] = useState(inicialMochilas);
  const [inventarioGeneral, setInventarioGeneral] = useState(inicialArmario);
  
  // Si hay listas, cogemos la primera. Si no, empezamos en null directamente.
  const [idListaActiva, setIdListaActiva] = useState(listas.length > 0 ? listas[0].id : null);

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem('ligerito_listas', JSON.stringify(listas));
  }, [listas]);

  useEffect(() => {
    localStorage.setItem('ligerito_armario', JSON.stringify(inventarioGeneral));
  }, [inventarioGeneral]);

  // Si no hay id activo, devolvemos un objeto con TODO vacío (Escudo contra pantalla blanca)
  const mochilaActiva = listas.find(l => l.id === idListaActiva) || { 
    id: null, 
    nombre: "Sin selección", 
    objetos: [], 
    categorias: [], // <-- Esto es lo que limpiará tu pantalla al borrar
    publica: false 
  };

  // --- FUNCIONES DE LÓGICA ---

  const crearNuevaLista = (nombre) => {
    const nueva = { 
      id: Date.now().toString(), 
      nombre: nombre, 
      objetos: [], 
      categorias: [], // <-- Empieza sin categorías como pediste
      publica: false 
    };
    setListas([...listas, nueva]);
    setIdListaActiva(nueva.id);
  };

  const borrarLista = (id) => {
    const filtradas = listas.filter(l => l.id !== id); 
    setListas(filtradas);

    if (id === idListaActiva) {
      setIdListaActiva(filtradas.length > 0 ? filtradas[0].id : null);
    }
  };

  const actualizarNombreLista = (nuevoNombre) => {
    setListas(listas.map(l => l.id === idListaActiva ? { ...l, nombre: nuevoNombre } : l));
  };

  const togglePublica = () => {
    setListas(listas.map(l => l.id === idListaActiva ? { ...l, publica: !l.publica } : l));
  };

  const manejarNuevoItem = (datos) => {
    if (!idListaActiva) return;
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

  // Función para manejar categorías dentro de la lista
const añadirCategoria = (nombreCat) => {
  if (!idListaActiva) return;

  setListas(prevListas => prevListas.map(l => {
    // Usamos == por si un ID es número y el otro string
    if (l.id == idListaActiva) {
      const catsActuales = l.categorias || [];
      // Si ya existe, no hacemos nada
      if (catsActuales.includes(nombreCat)) return l;
      
      // Devolvemos la mochila con la nueva categoría
      return { 
        ...l, 
        categorias: [...catsActuales, nombreCat] 
      };
    }
    return l;
  }));
};

  const eliminarCategoria = (nombre) => {
    if (!idListaActiva) return;
    setListas(listas.map(l => 
      l.id === idListaActiva 
        ? { ...l, categorias: l.categorias.filter(c => c !== nombre) } 
        : l
    ));
  };

  // Añade esta función dentro de useMochilas.js y expórtala en el return
const actualizarEnlaceItem = (idItem, nuevoEnlace) => {
    setListas(prevListas => prevListas.map(l => {
      // Buscamos la mochila que está activa actualmente
      if (l.id === idListaActiva) {
        return {
          ...l,
          objetos: l.objetos.map(obj => 
            obj.id === idItem ? { ...obj, enlace: nuevoEnlace } : obj
          )
        };
      }
      return l;
    }));
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
    eliminarObjeto,
    añadirCategoria,   
    eliminarCategoria, 
    actualizarEnlaceItem
  };
};