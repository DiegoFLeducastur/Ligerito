const BASE_URL = "http://localhost:8080/api/items-mochila";

export const getItemsMochila = async (mochilaId) => {
  const response = await fetch(`${BASE_URL}?mochilaId=${mochilaId}`);
  if (!response.ok) throw new Error("No se pudieron cargar los items de mochila");
  return await response.json();
};

export const createItemMochila = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("No se pudo añadir el item a la mochila");
  return await response.json();
};

export const patchItemMochila = async (id, data) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("No se pudo actualizar la cantidad del item");
  return await response.json();
};

export const deleteItemMochila = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("No se pudo eliminar el item de la mochila");
};