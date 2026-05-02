import { useState, useEffect } from "react";
import { patchItemArmario } from "../services/apiArmario";

const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// Datos iniciales
const inicialMochilas = JSON.parse(localStorage.getItem("ligerito_listas")) ?? [
  {
    id: "1",
    nombre: "Mochila Base",
    objetos: [],
    categorias: ["Ropa", "Cocina"],
    publica: false,
  },
];

const inicialArmario =
  JSON.parse(localStorage.getItem("ligerito_armario")) ?? [];

export const useMochilas = (onArmarioActualizado) => {
  const [listas, setListas] = useState(inicialMochilas);
  // Estado local heredado del armario.
  // Se mantiene temporalmente como fallback mientras convive la lógica local de mochilas.
  const [inventarioGeneral, setInventarioGeneral] = useState(inicialArmario);

  const [idListaActiva, setIdListaActiva] = useState(
    listas.length > 0 ? listas[0].id : null,
  );

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem("ligerito_listas", JSON.stringify(listas));
  }, [listas]);

  useEffect(() => {
    localStorage.setItem("ligerito_armario", JSON.stringify(inventarioGeneral));
  }, [inventarioGeneral]);

  const mochilaActiva = listas.find((l) => l.id === idListaActiva) || {
    id: null,
    nombre: "Sin selección",
    objetos: [],
    categorias: [],
    publica: false,
  };

  // --- helpers ---

  const obtenerItemArmarioId = (datos) =>
    datos.itemArmarioId ?? datos.id ?? null;

  const mismoItemBase = (obj, datos) => {
    const idBaseNuevo = obtenerItemArmarioId(datos);

    if (obj.itemArmarioId && idBaseNuevo) {
      return obj.itemArmarioId === idBaseNuevo;
    }

    return (
      (obj.nombre ?? "").toLowerCase().trim() ===
      (datos.nombre ?? "").toLowerCase().trim()
    );
  };

  const agregarListaPersistida = (mochilaBackend) => {
    const nueva = {
      id: mochilaBackend.id,
      nombre: mochilaBackend.nombre,
      publica: mochilaBackend.esPublica,
      objetos: [],
      categorias: [],
    };

    setListas((prev) => [...prev, nueva]);
    setIdListaActiva(nueva.id);
  };

  const hidratarListasDesdeBackend = (mochilasBackend) => {
    setListas((prev) =>
      mochilasBackend.map((m) => {
        const existente = prev.find((l) => String(l.id) === String(m.id));

        return {
          id: m.id,
          nombre: m.nombre,
          publica: m.esPublica,
          categorias: m.categorias ?? [],
          objetos: existente?.objetos ?? [],
        };
      }),
    );

    setIdListaActiva((prevId) => {
      const sigueExistiendo = mochilasBackend.some(
        (m) => String(m.id) === String(prevId),
      );

      if (sigueExistiendo) return prevId;
      return mochilasBackend.length > 0 ? mochilasBackend[0].id : null;
    });
  };

  // --- listas/mochilas ---

  const crearNuevaLista = (nombre) => {
      const nueva = {
        id: uid(),
        nombre,
        objetos: [],
        categorias: [],
        publica: false,
      };

      setListas((prev) => [...prev, nueva]);
      setIdListaActiva(nueva.id);
    };

    const borrarLista = (id) => {
      setListas((prev) => {
        const filtradas = prev.filter((l) => l.id !== id);
        if (id === idListaActiva) {
          setIdListaActiva(filtradas.length > 0 ? filtradas[0].id : null);
        }
        return filtradas;
      });
    };

    const actualizarNombreLista = (nuevoNombre) => {
      setListas((prev) =>
        prev.map((l) =>
          l.id === idListaActiva ? { ...l, nombre: nuevoNombre } : l,
        ),
      );
    };

    const togglePublica = () => {
      setListas((prev) =>
        prev.map((l) =>
          l.id === idListaActiva ? { ...l, publica: !l.publica } : l,
        ),
      );
    };

    // --- items de mochila ---

    const manejarNuevoItem = (datos) => {
      if (!idListaActiva) return;

      // 1) Añadir/incrementar en mochila activa
      setListas((prevListas) =>
        prevListas.map((l) => {
          if (l.id !== idListaActiva) return l;

          const existe = l.objetos.some(
            (obj) =>
              mismoItemBase(obj, datos) && obj.categoria === datos.categoria,
          );

          if (existe) {
            return {
              ...l,
              objetos: l.objetos.map((obj) =>
                mismoItemBase(obj, datos) && obj.categoria === datos.categoria
                  ? { ...obj, cant: obj.cant + 1 }
                  : obj,
              ),
            };
          }

          const nuevo = {
            ...datos,
            itemArmarioId: datos.itemArmarioId ?? datos.id ?? null,
            id: uid(),
            cant: 1,
          };
          return { ...l, objetos: [...l.objetos, nuevo] };
        }),
      );

      // 2) Añadir al armario si no existe (por nombre)
      setInventarioGeneral((prevInv) => {
        const yaExiste = prevInv.some((i) => mismoItemBase(i, datos));
        if (yaExiste) return prevInv;

        return [
          ...prevInv,
          {
            ...datos,
            id: obtenerItemArmarioId(datos) ?? uid(),
            itemArmarioId: obtenerItemArmarioId(datos),
          },
        ];
      });
    };

    const cambiarCantidad = (id, incremento) => {
      setListas((prev) =>
        prev.map((l) => {
          if (l.id !== idListaActiva) return l;
          const nuevos = l.objetos
            .map((o) => (o.id === id ? { ...o, cant: o.cant + incremento } : o))
            .filter((o) => o.cant > 0);
          return { ...l, objetos: nuevos };
        }),
      );
    };

    const eliminarObjeto = (id) => {
      setListas((prev) =>
        prev.map((l) =>
          l.id === idListaActiva
            ? { ...l, objetos: l.objetos.filter((o) => o.id !== id) }
            : l,
        ),
      );
    };

    // --- armario ---

    const eliminarItemInventario = (idArmario) => {
      const item = inventarioGeneral.find((i) => i.id === idArmario);
      const nombreKey = (item?.nombre ?? "").toLowerCase().trim();

      setInventarioGeneral((prev) => prev.filter((i) => i.id !== idArmario));

      setListas((prev) =>
        prev.map((l) => ({
          ...l,
          objetos: l.objetos.filter((o) => {
            if (o.itemArmarioId) {
              return o.itemArmarioId !== idArmario;
            }

            return (o.nombre ?? "").toLowerCase().trim() !== nombreKey;
          }),
        })),
      );
    };

    // --- categorías ---

    const añadirCategoria = (nombreCat) => {
      if (!idListaActiva) return;

      setListas((prev) =>
        prev.map((l) => {
          if (l.id !== idListaActiva) return l;
          const cats = l.categorias || [];
          if (cats.includes(nombreCat)) return l;
          return { ...l, categorias: [...cats, nombreCat] };
        }),
      );
    };

    const eliminarCategoria = (nombre) => {
      if (!idListaActiva) return;

      setListas((prev) =>
        prev.map((l) =>
          l.id === idListaActiva
            ? {
                ...l,
                categorias: (l.categorias || []).filter((c) => c !== nombre),
                objetos: (l.objetos || []).filter(
                  (o) => o.categoria !== nombre,
                ),
              }
            : l,
        ),
      );
    };

  // --- edición global de item ---

  const actualizarCampoItem = async (idItem, campo, valor) => {
    // 1) Actualiza en la mochila activa para que la UI responda al instante
    setListas((prev) =>
      prev.map((l) => {
        if (l.id !== idListaActiva) return l;
        return {
          ...l,
          objetos: l.objetos.map((obj) =>
            obj.id === idItem ? { ...obj, [campo]: valor } : obj,
          ),
        };
      }),
    );

    // 2) Buscar el objeto actual dentro de la mochila
    const objActual = mochilaActiva.objetos.find((o) => o.id === idItem);
    if (!objActual) return;

    // 3) Si tiene referencia al backend, parcheamos
    if (objActual.itemArmarioId) {
      try {
        await patchItemArmario(objActual.itemArmarioId, { [campo]: valor });
        await onArmarioActualizado?.();
      } catch (error) {
        console.error(`Error actualizando ${campo} en backend:`, error);
      }
      return;
    }

    // 4) Fallback: actualizar armario local por nombre mientras no haya itemArmarioId
    const nombreKey = objActual.nombre?.toLowerCase().trim();
    if (!nombreKey) return;

    setInventarioGeneral((prevInv) =>
      prevInv.map((i) =>
        i.nombre.toLowerCase().trim() === nombreKey
          ? { ...i, [campo]: valor }
          : i,
      ),
    );
  };

  const actualizarPesoItem = (idItem, nuevoPeso) => {
    const pesoNum = Number(nuevoPeso);
    if (!Number.isFinite(pesoNum) || pesoNum < 0) return;
    return actualizarCampoItem(idItem, "peso", pesoNum);
  };

  const actualizarDescripcionItem = (idItem, nuevaDescripcion) =>
    actualizarCampoItem(
      idItem,
      "descripcion",
      (nuevaDescripcion ?? "").toString(),
    );

  const actualizarEnlaceItem = (idItem, nuevoEnlace) =>
    actualizarCampoItem(idItem, "enlace", (nuevoEnlace ?? "").toString());

  return {
    actualizarDescripcionItem,
    actualizarEnlaceItem,
    actualizarNombreLista,
    actualizarPesoItem,
    añadirCategoria,
    borrarLista,
    cambiarCantidad,
    crearNuevaLista,
    eliminarCategoria,
    eliminarItemInventario,
    eliminarObjeto,
    idListaActiva,
    inventarioGeneral,
    listas,
    manejarNuevoItem,
    mochilaActiva,
    setIdListaActiva,
    togglePublica,
    agregarListaPersistida,
    hidratarListasDesdeBackend,
  };
};
