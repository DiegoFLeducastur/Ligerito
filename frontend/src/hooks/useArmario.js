import { useState } from "react";
import {
  getArmario,
  createItemArmario,
  deleteItemArmario,
} from "../services/apiArmario";

export const useArmario = () => {
  const [armario, setArmario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargar = async (usuarioId) => {
    setError("");
    setLoading(true);
    try {
      const data = await getArmario(usuarioId);
      setArmario(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const crear = async (datos) => {
    const itemCreado = await createItemArmario(datos);
    setArmario((prev) => [...prev, itemCreado]);
    return itemCreado;
  };

  const eliminar = async (id) => {
    await deleteItemArmario(id);
    setArmario((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarItem = (id, cambios) => {
    setArmario((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...cambios } : item)),
    );
  };

  return { armario, loading, error, cargar, crear, eliminar, actualizarItem };
};
