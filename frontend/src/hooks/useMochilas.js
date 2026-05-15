import { useState } from "react";
import { patchItemArmario } from "../services/apiArmario";

export const useMochilas = (onActualizarItemArmario) => {
  const [listas, setListas] = useState([]);

  const [idListaActiva, setIdListaActiva] = useState(null);

  const mochilaActiva = listas.find((l) => l.id === idListaActiva) || {
    id: null,
    nombre: "Sin selección",
    objetos: [],
    categorias: [],
    publica: false,
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
          objetos: m.objetos ?? existente?.objetos ?? [],
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

    // --- armario ---

    const eliminarItemInventario = (idArmario) => {
      setListas((prev) =>
        prev.map((l) => ({
          ...l,
          objetos: l.objetos.filter((o) => o.itemArmarioId !== idArmario),
        })),
      );
    };

  // --- edición global de item ---

  const actualizarCampoItem = async (idItem, campo, valor) => {
    const objActual = mochilaActiva.objetos.find((o) => o.id === idItem);
    if (!objActual) return;

    // Propaga el cambio a todas las mochilas que contengan el mismo ItemArmario
    setListas((prev) =>
      prev.map((l) => ({
        ...l,
        objetos: l.objetos.map((obj) =>
          obj.itemArmarioId === objActual.itemArmarioId
            ? { ...obj, [campo]: valor }
            : obj,
        ),
      })),
    );

    if (objActual.itemArmarioId) {
      onActualizarItemArmario?.(objActual.itemArmarioId, { [campo]: valor });
      try {
        await patchItemArmario(objActual.itemArmarioId, { [campo]: valor });
      } catch (error) {
        console.error(`Error actualizando ${campo} en backend:`, error);
      }
    }
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
    borrarLista,
    eliminarItemInventario,
    idListaActiva,
    listas,
    mochilaActiva,
    setIdListaActiva,
    togglePublica,
    agregarListaPersistida,
    hidratarListasDesdeBackend,
  };
};
