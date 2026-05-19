const BASE = "/api/armario";

export const getArmario = async (usuarioId) => {
  const res = await fetch(`${BASE}?usuarioId=${usuarioId}`);
  if (!res.ok) throw new Error("Error al cargar el armario");
  return res.json();
};

export const createItemArmario = async (datos) => {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("No se pudo crear el item en el armario");
  return res.json();
};

export const deleteItemArmario = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("No se pudo eliminar el item del armario");
};

export const patchItemArmario = async (id, cambios) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
  if (!res.ok) throw new Error("No se pudo actualizar el item de armario");
  return res.json();
};
